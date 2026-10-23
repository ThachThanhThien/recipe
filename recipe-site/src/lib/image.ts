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

// Share links ("…/file/d/<id>/view", "…/open?id=<id>", "…/uc?id=<id>") open Drive's
// viewer page, not the image itself.
const DRIVE_LINK =
  /^https?:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/([\w-]{10,})|(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]{10,}))/i;

/** Longest side requested from Google Drive; recipe-portal stores photos at this size. */
const DRIVE_MAX_SIDE = 1600;

/** The file id of a Google Drive share link, or null for any other URL. */
export function driveFileId(url: string): string | null {
  const match = url.match(DRIVE_LINK);
  return match ? (match[1] ?? match[2]) : null;
}

/**
 * Absolute URLs pass through, except Google Drive share links (recipe-portal stores
 * those after uploading to Drive), which become a direct image URL. Relative ones
 * (e.g. `/uploads/pho.webp`, committed into `public/uploads/`) are served by this site.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!hasImage(url)) return null;
  const trimmed = url.trim();
  const driveId = driveFileId(trimmed);
  // Drive's own `uc?export=view` links no longer embed reliably; this host serves the
  // image of any file shared as "Anyone with the link". Keep it in this one place.
  if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}=w${DRIVE_MAX_SIDE}`;
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function fallbackGradient(seed: string | number): string {
  const key = String(seed);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}
