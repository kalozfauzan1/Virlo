export const YOUTUBE_COOKIES_STORAGE_KEY = 'youtubeCookies_v1';

export function normalizeYouTubeCookies(text) {
  const normalized = String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  return normalized ? `${normalized}\n` : '';
}

export function validateYouTubeCookies(text) {
  const normalized = normalizeYouTubeCookies(text);

  if (!normalized) {
    return {
      ok: false,
      message: 'Cookies file is empty.'
    };
  }

  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  const hasNetscapeRows = lines.some((line) => line.split('\t').length >= 7);
  const hasYouTubeDomain = lines.some((line) => {
    const lower = line.toLowerCase();
    return lower.includes('youtube.com') || lower.includes('google.com');
  });

  if (!hasNetscapeRows) {
    return {
      ok: false,
      message: 'Cookies must be in Netscape cookies.txt format.'
    };
  }

  if (!hasYouTubeDomain) {
    return {
      ok: false,
      message: 'Cookies must include youtube.com or google.com entries.'
    };
  }

  return {
    ok: true,
    message: 'YouTube cookies look valid.'
  };
}

export function summarizeYouTubeCookies(text) {
  const normalized = normalizeYouTubeCookies(text);
  const lines = normalized
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'));

  const domains = new Set();

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts[0]) domains.add(parts[0]);
  }

  return {
    lineCount: lines.length,
    domainCount: domains.size,
    hasCookies: lines.length > 0
  };
}
