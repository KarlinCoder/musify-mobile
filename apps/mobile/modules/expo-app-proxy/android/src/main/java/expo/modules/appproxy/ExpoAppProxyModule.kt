
package expo.modules.appproxy

import com.facebook.react.modules.network.OkHttpClientProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import okhttp3.Authenticator
import okhttp3.Credentials
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Route
import okhttp3.Response
import java.net.InetSocketAddress
import java.net.Proxy
import java.util.concurrent.TimeUnit

class ExpoAppProxyModule : Module() {

  private var host: String? = null
  private var port: Int? = null
  private var type: String? = null
  private var username: String? = null
  private var password: String? = null

  private fun makeProxy(
    type: String,
    host: String,
    port: Int
  ): Proxy {
    require(host.isNotBlank()) {
      "Proxy host cannot be empty"
    }

    require(port in 1..65535) {
      "Proxy port must be between 1 and 65535"
    }

    val proxyType = when (type.lowercase()) {
      "http" -> Proxy.Type.HTTP
      "socks5" -> Proxy.Type.SOCKS
      else -> throw IllegalArgumentException(
        "Supported proxy types: http, socks5"
      )
    }

    return Proxy(
      proxyType,
      InetSocketAddress.createUnresolved(host, port)
    )
  }

  private fun makeClient(
    proxy: Proxy?,
    type: String? = null,
    username: String? = null,
    password: String? = null
  ): OkHttpClient {
    val builder = OkHttpClient.Builder()
      .connectTimeout(15, TimeUnit.SECONDS)
      .readTimeout(15, TimeUnit.SECONDS)
      .writeTimeout(15, TimeUnit.SECONDS)

    if (proxy != null) {
      builder.proxy(proxy)
    } else {
      builder.proxy(Proxy.NO_PROXY)
    }

    if (!username.isNullOrEmpty() && !password.isNullOrEmpty()) {
      require(type == "http") {
        "SOCKS5 username/password authentication is not supported by this module"
      }

      builder.proxyAuthenticator(
        Authenticator { _: Route?, response: Response ->
          // Prevent retry loops with invalid credentials.
          if (response.request.header("Proxy-Authorization") != null) {
            return@Authenticator null
          }

          response.request.newBuilder()
            .header(
              "Proxy-Authorization",
              Credentials.basic(username, password)
            )
            .build()
        }
      )
    }

    return builder.build()
  }

  private fun applyClient(client: OkHttpClient) {
    // React Native resolves all HTTP clients through this factory, so registering
    // it here makes the proxy-configured client the one used for networking.
    OkHttpClientProvider.setOkHttpClientFactory {
      client
    }
  }

  override fun definition() = ModuleDefinition {
    Name("ExpoAppProxy")

    Function("setProxy") { config: Map<String, Any?> ->
      val newType = (config["type"] as? String ?: "http")
        .lowercase()

      val newHost = config["host"] as? String
        ?: throw IllegalArgumentException("Proxy host is required")

      val newPort = (config["port"] as? Number)?.toInt()
        ?: throw IllegalArgumentException("Proxy port is required")

      val newUsername = config["username"] as? String
      val newPassword = config["password"] as? String

      require((newUsername.isNullOrEmpty()) ==
        (newPassword.isNullOrEmpty())) {
        "Provide both username and password, or neither"
      }

      require(newUsername.isNullOrEmpty() || newType == "http") {
        "Authenticated SOCKS5 is not supported by this implementation"
      }

      val proxy = makeProxy(newType, newHost, newPort)
      val client = makeClient(
        proxy,
        newType,
        newUsername,
        newPassword
      )

      applyClient(client)

      host = newHost
      port = newPort
      type = newType
      username = newUsername
      password = newPassword

      true
    }

    Function("getProxy") {
      val savedHost = host
      val savedPort = port
      val savedType = type

      if (savedHost == null || savedPort == null || savedType == null) {
        null
      } else {
        mapOf(
          "type" to savedType,
          "host" to savedHost,
          "port" to savedPort,
          "hasAuth" to (!username.isNullOrEmpty())
        )
      }
    }

    Function("clearProxy") {
      applyClient(makeClient(null))

      host = null
      port = null
      type = null
      username = null
      password = null

      true
    }

    AsyncFunction("testProxy") { config: Map<String, Any?> ->
      val testType = (config["type"] as? String ?: "http")
        .lowercase()

      val testHost = config["host"] as? String
        ?: throw IllegalArgumentException("Proxy host is required")

      val testPort = (config["port"] as? Number)?.toInt()
        ?: throw IllegalArgumentException("Proxy port is required")

      val testUsername = config["username"] as? String
      val testPassword = config["password"] as? String

      require((testUsername.isNullOrEmpty()) ==
        (testPassword.isNullOrEmpty())) {
        "Provide both username and password, or neither"
      }

      require(testUsername.isNullOrEmpty() || testType == "http") {
        "Authenticated SOCKS5 is not supported by this implementation"
      }

      val url = config["url"] as? String
        ?: "https://api.ipify.org?format=json"

      val proxy = makeProxy(testType, testHost, testPort)
      val client = makeClient(
        proxy,
        testType,
        testUsername,
        testPassword
      )

      val request = Request.Builder()
        .url(url)
        .get()
        .build()

      client.newCall(request).execute().use { response ->
        mapOf(
          "success" to response.isSuccessful,
          "status" to response.code,
          "body" to (response.body?.string() ?: "")
        )
      }
    }
  }
}
