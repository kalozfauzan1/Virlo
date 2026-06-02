const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function getApiUrl(path: string): string {
  if (API_URL) return `${API_URL}${path}`;
  return path; // Relies on Next.js rewrites proxy
}

export interface JobResult {
  job_id: string;
  status: string;
  result?: {
    clips?: {
      path: string;
      start: number;
      end: number;
      score: number;
      title?: string;
      thumbnail?: string;
    }[];
    cost_analysis?: {
      total_cost: number;
      input_tokens: number;
      output_tokens: number;
    };
  };
  logs?: string[];
  error?: string;
}

export async function pollJob(jobId: string): Promise<JobResult> {
  const res = await fetch(getApiUrl(`/api/status/${jobId}`));
  if (!res.ok) throw new Error("Status check failed");
  return res.json();
}

export async function submitJob(params: {
  apiKey: string;
  groqKey?: string;
  transcriptionMethod: string;
  cropStyle?: string;
  acknowledged?: boolean;
} & (
  | { type: "url"; url: string }
  | { type: "file"; file: File }
)): Promise<{ job_id: string }> {
  const headers: Record<string, string> = {
    "X-Gemini-Key": params.apiKey,
  };

  if (params.type === "url") {
    headers["Content-Type"] = "application/json";
    const body = JSON.stringify({
      url: params.url,
      acknowledged: !!params.acknowledged,
      transcription_method: params.transcriptionMethod,
      groq_key: params.groqKey,
      crop_style: params.cropStyle || "blur_bars",
    });
    const res = await fetch(getApiUrl("/api/process"), {
      method: "POST",
      headers,
      body,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("acknowledged", params.acknowledged ? "true" : "false");
  formData.append("transcription_method", params.transcriptionMethod);
  if (params.groqKey) formData.append("groq_key", params.groqKey);
  formData.append("crop_style", params.cropStyle || "blur_bars");

  const res = await fetch(getApiUrl("/api/process"), {
    method: "POST",
    headers: { "X-Gemini-Key": params.apiKey },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchUserProfiles(uploadPostKey: string) {
  const res = await fetch(getApiUrl("/api/social/user"), {
    headers: { "X-Upload-Post-Key": uploadPostKey },
  });
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}

export async function fetchReplizAccounts(
  accessKey: string,
  secretKey: string
) {
  const res = await fetch(
    getApiUrl(
      `/api/repliz/accounts?access_key=${encodeURIComponent(accessKey)}&secret_key=${encodeURIComponent(secretKey)}`
    )
  );
  if (!res.ok) throw new Error("Failed to fetch Repliz accounts");
  return res.json();
}
