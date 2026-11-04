import type { AxiosInstance } from "axios";
import {
  ARL_AUTH_API,
  DEFAULT_FAVORITE_ARTISTS,
  PIPE_API,
} from "./constants";
import { DeezerError } from "./errors";
import { logMessage } from "./utils";

type GraphQLError = {
  message?: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

type AddArtistToFavoriteData = {
  addArtistToFavorite?: {
    artist?: {
      id: string;
      name: string;
    };
  };
};

type FavoriteArtistsData = {
  me?: {
    userFavorites?: {
      artists?: {
        edges?: Array<{
          node?: {
            id: string;
            name: string;
          };
        }>;
      };
    };
  };
};

type OnboardingStateData = {
  me?: {
    onboarding?: {
      shouldBeOnboarded?: boolean;
      currentStep?: string | null;
      version?: string;
    };
  };
};

type ValidateOnboardingData = {
  validateOnboardingArtistsPickerStep?: {
    status?: boolean;
    onboarding?: {
      shouldBeOnboarded?: boolean;
      currentStep?: string | null;
      version?: string;
    };
  };
};

type RecommendationsData = {
  me?: {
    recommendations?: {
      artists?: {
        edges?: unknown[];
      };
      hotTracks?: unknown[];
    };
  };
};

const ADD_ARTIST_TO_FAVORITE = `mutation AddArtistToFavorite($artistId: String!) {
  addArtistToFavorite(artistId: $artistId) {
    artist {
      id
      name
    }
  }
}`;

const GET_FAVORITE_ARTISTS = `query GetFavoriteArtists {
  me {
    userFavorites {
      artists(first: 50) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
}`;

const GET_ONBOARDING = `query GetOnboarding {
  me {
    onboarding {
      shouldBeOnboarded
      currentStep
      version
    }
  }
}`;

const VALIDATE_ARTISTS_PICKER = `mutation ValidateOnboardingArtistsPickerStep($input: ValidateOnboardingArtistsPickerStepInput!) {
  validateOnboardingArtistsPickerStep(input: $input) {
    status
    onboarding {
      shouldBeOnboarded
      currentStep
      version
    }
  }
}`;

const GET_RECOMMENDATIONS = `query GetRecommendations {
  me {
    recommendations {
      artists(first: 5) {
        edges {
          node {
            id
            name
          }
        }
      }
      hotTracks(limit: 5) {
        id
        title
      }
    }
  }
}`;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const getJwt = async (http: AxiosInstance, arl: string) => {
  const res = await http.post(ARL_AUTH_API, undefined, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `arl=${arl}`,
    },
  });
  const jwt = res.data?.jwt;
  if (!jwt)
    throw new DeezerError("No se pudo autenticar la cuenta para configurarla");
  return jwt as string;
};

const requestGraphQL = async <T>(
  http: AxiosInstance,
  jwt: string,
  query: string,
  variables: Record<string, unknown> = {},
) => {
  const res = await http.post<GraphQLResponse<T>>(
    PIPE_API,
    { query, variables },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
    },
  );
  const body = res.data;
  if (body?.errors?.length) {
    const message = body.errors
      .map((error) => error.message ?? "Error GraphQL")
      .join("; ");
    throw new DeezerError(`Deezer GraphQL: ${message}`);
  }
  if (!body?.data)
    throw new DeezerError("Deezer GraphQL devolvio una respuesta vacia");
  return body.data;
};

export const seedDeezerAccount = async (
  http: AxiosInstance,
  arl: string,
) => {
  logMessage("Autenticando la cuenta para configurar el perfil...");
  const jwt = await getJwt(http, arl);

  logMessage("Agregando artistas favoritos...");
  for (const artist of DEFAULT_FAVORITE_ARTISTS) {
    const data = await requestGraphQL<AddArtistToFavoriteData>(
      http,
      jwt,
      ADD_ARTIST_TO_FAVORITE,
      { artistId: artist.id },
    );
    if (!data.addArtistToFavorite?.artist)
      throw new DeezerError(
        `Deezer no agrego el artista a favoritos: ${artist.name}`,
      );
    logMessage(`Artista favorito agregado: ${artist.name}`);
    await wait(300);
  }

  const favorites = await requestGraphQL<FavoriteArtistsData>(
    http,
    jwt,
    GET_FAVORITE_ARTISTS,
  );
  const favoriteIds = new Set<string>();
  for (const edge of favorites.me?.userFavorites?.artists?.edges ?? []) {
    if (edge.node?.id) favoriteIds.add(edge.node.id);
  }
  const missing = DEFAULT_FAVORITE_ARTISTS.filter(
    (artist) => !favoriteIds.has(artist.id),
  );
  if (missing.length)
    throw new DeezerError(
      `Faltan artistas favoritos: ${missing.map((artist) => artist.name).join(", ")}`,
    );
  logMessage(`Artistas favoritos confirmados: ${favoriteIds.size}`);

  const onboarding = await requestGraphQL<OnboardingStateData>(
    http,
    jwt,
    GET_ONBOARDING,
  );
  if (onboarding.me?.onboarding?.shouldBeOnboarded) {
    logMessage("Completando el onboarding de artistas...");
    const validated = await requestGraphQL<ValidateOnboardingData>(
      http,
      jwt,
      VALIDATE_ARTISTS_PICKER,
      {
        input: {
          artistIds: DEFAULT_FAVORITE_ARTISTS.map((artist) => artist.id),
        },
      },
    );
    const result = validated.validateOnboardingArtistsPickerStep;
    if (!result?.status)
      throw new DeezerError("Deezer rechazo el onboarding de artistas");
    logMessage(
      `Onboarding completado (${result.onboarding?.version ?? "artists"}).`,
    );
  } else {
    logMessage("El onboarding de la cuenta ya estaba completado.");
  }

  let recommendationCounts = { artists: 0, tracks: 0 };
  for (let attempt = 0; attempt < 3; attempt++) {
    const recommendations = await requestGraphQL<RecommendationsData>(
      http,
      jwt,
      GET_RECOMMENDATIONS,
    );
    recommendationCounts = {
      artists:
        recommendations.me?.recommendations?.artists?.edges?.length ?? 0,
      tracks: recommendations.me?.recommendations?.hotTracks?.length ?? 0,
    };
    if (recommendationCounts.artists || recommendationCounts.tracks) break;
    await wait(1000);
  }
  logMessage(
    `Recomendaciones disponibles: ${recommendationCounts.artists} artistas, ${recommendationCounts.tracks} pistas.`,
  );
  if (!recommendationCounts.artists && !recommendationCounts.tracks)
    throw new DeezerError(
      "Deezer no devolvio recomendaciones para la cuenta configurada",
    );

  return recommendationCounts;
};
