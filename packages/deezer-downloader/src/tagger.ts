import { ID3Writer } from "browser-id3-writer";
import { File, Paths } from "expo-file-system";
import { getTrack } from "deezer-sdk";
import { proxyUrl } from "./http";

/**
 * Valores de los enums de browser-id3-writer: el runtime solo exporta
 * ID3Writer y el d.ts los declara como `const enum` (inutilizables con
 * isolatedModules), así que van como literales.
 */
const APIC_COVER_FRONT = 0x03;
const SYLT_LYRICS = 0x01;
const SYLT_MILLISECONDS = 0x02;

/** La cover de Deezer viene en 264x264; se pide en 1000x1000 para el APIC. */
const COVER_RESOLUTION = "1000x1000";

export interface TagOptions {
  signal?: AbortSignal;
}

/** Extrae año y DDMM del releaseDate (formato ISO devuelto por pipe.deezer). */
function parseReleaseDate(
  releaseDate: unknown,
): { year: number; dayMonth: string } | null {
  if (typeof releaseDate !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(releaseDate);
  if (!match) return null;
  return { year: Number(match[1]), dayMonth: `${match[3]}${match[2]}` };
}

/** Descarga la portada (vía proxy) a la caché y devuelve sus bytes. */
async function fetchCover(
  url: string,
  trackId: string,
): Promise<ArrayBuffer | null> {
  const file = new File(
    Paths.cache,
    `deezer-cover-${trackId}-${Date.now()}.jpg`,
  );
  try {
    await File.downloadFileAsync(
      proxyUrl(url.replace(/\d+x\d+/, COVER_RESOLUTION)),
      file,
      { idempotent: true },
    );
    return await file.arrayBuffer();
  } catch {
    return null;
  } finally {
    try {
      if (file.exists) file.delete();
    } catch {}
  }
}

/**
 * Escribe todos los tags ID3v2.3 posibles en el MP3 descargado: metadatos de
 * `dz.getTrack`, portada (APIC), letras (USLT/SYLT) y datos de Deezer (TXXX).
 * Reemplaza cualquier tag previo del archivo.
 */
export async function applyTags(
  file: File,
  trackId: string | number,
  opts: TagOptions = {},
): Promise<void> {
  const track = await getTrack({ trackId: String(trackId) });
  if (!track) throw new Error(`Sin metadatos para la pista ${trackId}`);
  if (opts.signal?.aborted) throw new Error("Descarga cancelada");

  const edges = track.contributors.edges;
  const main = edges
    .filter((edge) => edge.roles.includes("MAIN"))
    .map((edge) => edge.node.name);
  const featured = edges
    .filter((edge) => edge.roles.includes("FEATURED"))
    .map((edge) => edge.node.name);
  const artists = [...new Set([...main, ...featured])];

  const writer = new ID3Writer(await file.arrayBuffer());

  if (track.title) writer.setFrame("TIT2", track.title);
  if (artists.length) writer.setFrame("TPE1", artists);
  if (main[0]) writer.setFrame("TPE2", main[0]);
  if (track.album?.displayTitle)
    writer.setFrame("TALB", track.album.displayTitle);
  if (track.diskInfo?.trackNumber != null)
    writer.setFrame("TRCK", String(track.diskInfo.trackNumber));
  if (track.diskInfo?.diskNumber != null)
    writer.setFrame("TPOS", String(track.diskInfo.diskNumber));
  if (track.ISRC) writer.setFrame("TSRC", track.ISRC);
  if (track.duration) writer.setFrame("TLEN", track.duration * 1000);

  const date = parseReleaseDate(track.releaseDate);
  if (date) {
    writer.setFrame("TYER", date.year);
    writer.setFrame("TDAT", date.dayMonth);
  }

  const lyrics = track.lyrics;
  if (lyrics?.copyright) writer.setFrame("TCOP", lyrics.copyright);
  if (lyrics?.writers) writer.setFrame("TEXT", lyrics.writers);
  if (lyrics?.text)
    writer.setFrame("USLT", { description: "Lyrics", lyrics: lyrics.text });

  const lines = (lyrics?.synchronizedLines ?? [])
    .map((line) => [line.line, line.milliseconds] as const)
    .filter(
      (line): line is readonly [string, number] =>
        line[1] != null && line[0].trim() !== "",
    )
    .map(([text, milliseconds]) => [text, milliseconds] as [string, number]);
  if (lines.length) {
    writer.setFrame("SYLT", {
      type: SYLT_LYRICS,
      text: lines,
      timestampFormat: SYLT_MILLISECONDS,
      description: "Lyrics",
    });
  }

  writer.setFrame("TSSE", "musify");
  writer.setFrame("COMM", { description: "Source", text: "Deezer" });
  writer.setFrame("WXXX", {
    description: "Deezer",
    value: `https://www.deezer.com/track/${track.id}`,
  });

  writer.setFrame("TXXX", { description: "DEEZER_TRACK_ID", value: track.id });
  if (track.album)
    writer.setFrame("TXXX", {
      description: "DEEZER_ALBUM_ID",
      value: track.album.id,
    });
  const mainEdge = edges.find((edge) => edge.roles.includes("MAIN"));
  if (mainEdge)
    writer.setFrame("TXXX", {
      description: "DEEZER_ARTIST_ID",
      value: mainEdge.node.id,
    });
  writer.setFrame("TXXX", {
    description: "EXPLICIT",
    value: track.isExplicit ? "1" : "0",
  });
  writer.setFrame("TXXX", {
    description: "ATMOS",
    value: track.isAtmos ? "1" : "0",
  });
  if (typeof track.releaseDate === "string")
    writer.setFrame("TXXX", {
      description: "RELEASE_DATE",
      value: track.releaseDate,
    });
  if (track.popularity != null)
    writer.setFrame("TXXX", {
      description: "POPULARITY",
      value: String(track.popularity),
    });

  const coverUrl = track.album?.cover?.urls[0];
  if (coverUrl) {
    const cover = await fetchCover(coverUrl, track.id);
    if (cover)
      writer.setFrame("APIC", {
        type: APIC_COVER_FRONT,
        data: cover,
        description: "Cover",
      });
  }

  file.write(new Uint8Array(writer.addTag()));
}
