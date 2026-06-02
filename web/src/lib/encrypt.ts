const SECRET_KEY = "Virlo-Static-Salt-Change-Me";
const ENCRYPTION_PREFIX = "ENC:";

export function encrypt(text: string): string {
  if (!text) return "";
  try {
    const xor = text
      .split("")
      .map((c, i) =>
        String.fromCharCode(
          c.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
        )
      )
      .join("");
    return ENCRYPTION_PREFIX + btoa(xor);
  } catch {
    return text;
  }
}

export function decrypt(text: string): string {
  if (!text) return "";
  if (text.startsWith(ENCRYPTION_PREFIX)) {
    try {
      const raw = text.slice(ENCRYPTION_PREFIX.length);
      const xor = atob(raw);
      return xor
        .split("")
        .map((c, i) =>
          String.fromCharCode(
            c.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
          )
        )
        .join("");
    } catch {
      return "";
    }
  }
  return text;
}
