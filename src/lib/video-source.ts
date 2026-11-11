// Turns whatever was pasted into a project's video field (YouTube/Vimeo page
// links, share links, or a direct file) into something a browser can play.

export interface PlayableVideo {
  kind: "iframe" | "file";
  src: string;
}

export function toPlayableVideo(
  raw: string | null | undefined,
): PlayableVideo | null {
  const url = raw?.trim();
  if (!url) return null;

  const yt = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }

  // vimeo.com/123, vimeo.com/123/abcdef (unlisted hash), player.vimeo.com/video/123?h=abcdef
  const vm = url.match(
    /vimeo\.com\/(?:.*?\/)?(?:video\/)?(\d+)(?:\/([\da-f]+))?(?:[?#]|$)/,
  );
  if (vm) {
    const hash = vm[2] || url.match(/[?&]h=([\da-f]+)/)?.[1];
    const h = hash ? `&h=${hash}` : "";
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1&title=0&byline=0&portrait=0${h}`,
    };
  }

  return { kind: "file", src: url };
}
