import { encrypt, decrypt } from "./encrypt";

/* ========================================
   localStorage keys — all prefixed with virlo_
   ======================================== */
const KEYS = {
  geminiKey: "virlo_gemini_key",
  uploadPostKey: "virlo_upload_post_key",
  uploadUserId: "virlo_upload_user_id",
  elevenLabsKey: "virlo_eleven_labs_key",
  falKey: "virlo_fal_key",
  groqKey: "virlo_groq_key",
  replizAccessKey: "virlo_repliz_access_key",
  replizSecretKey: "virlo_repliz_secret_key",
  transcriptionMethod: "virlo_transcription_method",
  session: "virlo_session",
  skipLanding: "virlo_skip_landing",
} as const;

export const store = {
  // Gemini
  getGeminiKey: () => localStorage.getItem(KEYS.geminiKey) || "",
  setGeminiKey: (v: string) => localStorage.setItem(KEYS.geminiKey, v),

  // Upload-Post
  getUploadPostKey: () => decrypt(localStorage.getItem(KEYS.uploadPostKey) || ""),
  setUploadPostKey: (v: string) =>
    localStorage.setItem(KEYS.uploadPostKey, encrypt(v)),
  getUploadUserId: () => localStorage.getItem(KEYS.uploadUserId) || "",
  setUploadUserId: (v: string) =>
    localStorage.setItem(KEYS.uploadUserId, v),

  // ElevenLabs
  getElevenLabsKey: () =>
    decrypt(localStorage.getItem(KEYS.elevenLabsKey) || ""),
  setElevenLabsKey: (v: string) =>
    localStorage.setItem(KEYS.elevenLabsKey, encrypt(v)),

  // fal.ai
  getFalKey: () => decrypt(localStorage.getItem(KEYS.falKey) || ""),
  setFalKey: (v: string) => localStorage.setItem(KEYS.falKey, encrypt(v)),

  // Groq
  getGroqKey: () => decrypt(localStorage.getItem(KEYS.groqKey) || ""),
  setGroqKey: (v: string) => localStorage.setItem(KEYS.groqKey, encrypt(v)),

  // Repliz
  getReplizAccessKey: () =>
    decrypt(localStorage.getItem(KEYS.replizAccessKey) || ""),
  setReplizAccessKey: (v: string) =>
    localStorage.setItem(KEYS.replizAccessKey, encrypt(v)),
  getReplizSecretKey: () =>
    decrypt(localStorage.getItem(KEYS.replizSecretKey) || ""),
  setReplizSecretKey: (v: string) =>
    localStorage.setItem(KEYS.replizSecretKey, encrypt(v)),

  // Transcription
  getTranscriptionMethod: () =>
    localStorage.getItem(KEYS.transcriptionMethod) || "faster-whisper",
  setTranscriptionMethod: (v: string) =>
    localStorage.setItem(KEYS.transcriptionMethod, v),

  // Session
  getSession: () => {
    try {
      const raw = localStorage.getItem(KEYS.session);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setSession: (data: unknown) =>
    localStorage.setItem(KEYS.session, JSON.stringify(data)),
  clearSession: () => localStorage.removeItem(KEYS.session),

  // Landing skip
  getSkipLanding: () => localStorage.getItem(KEYS.skipLanding) === "1",
  setSkipLanding: (v: boolean) =>
    localStorage.setItem(KEYS.skipLanding, v ? "1" : "0"),
};
