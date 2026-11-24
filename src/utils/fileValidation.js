const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateUploadFile(file, allowedPrefixes = ['image/']) {
  if (!file) {
    return { ok: false, error: 'No file selected.' };
  }
  const type = (file.type || '').toLowerCase();
  const matchesType =
    allowedPrefixes.some((prefix) => type.startsWith(prefix)) ||
    // Fallback for extension checks when browser strips MIME type
    (!type && /\.(png|jpe?g|webp|gif|svg|mp4|webm|mov|mp3|wav|ogg|m4a)$/i.test(file.name));

  if (!matchesType) {
    return {
      ok: false,
      error: `Unsupported file type "${file.type || file.name}". Expected ${allowedPrefixes.map((p) => p.replace('/', '')).join(', ')}.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, error: 'Selected file is empty (0 bytes).' };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return { ok: false, error: `File too large (${sizeMb} MB). Max limit is 25 MB.` };
  }
  return { ok: true, error: null };
}
