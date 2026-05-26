const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg,#FF6B35 0%,#FFB088 100%)",
  "linear-gradient(135deg,#4CAF50 0%,#A8E6A1 100%)",
  "linear-gradient(135deg,#A37E58 0%,#E8C9A5 100%)",
  "linear-gradient(135deg,#2E7D6B 0%,#7FC8B4 100%)",
  "linear-gradient(135deg,#C2185B 0%,#F48FB1 100%)",
];

export function hasImage(url: string | null | undefined): url is string {
  return !!url && url.trim().length > 0;
}

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!hasImage(url)) return null;
  const trimmed = url.trim();
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  return `${apiBase}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export function fallbackGradient(seed: string | number): string {
  const key = String(seed);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}
