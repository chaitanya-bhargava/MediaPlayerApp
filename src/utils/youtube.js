const YOUTUBE_REGEX = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export function parseYoutubeId(url) {
  const match = url.match(YOUTUBE_REGEX);
  return match && match[7].length === 11 ? match[7] : null;
}

export function isValidYoutubeUrl(url) {
  return parseYoutubeId(url) !== null;
}

export function getYoutubeThumbnail(url) {
  const id = parseYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}
