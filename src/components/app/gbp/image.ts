"use client";

// Server Actions accept ~1 MB request bodies by default, so keep uploads comfortably below that.
const LIMIT = 900_000;

/** Reads an image file and downscales it to a JPEG data URL small enough to send to the server. */
export async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`“${file.name}” isn't an image.`);
  if (file.size > 20 * 1024 * 1024) throw new Error(`“${file.name}” is larger than 20 MB.`);
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`Couldn't read “${file.name}”.`));
      el.src = url;
    });
    const nw = img.naturalWidth || 1200;
    const nh = img.naturalHeight || 900;
    let out = "";
    for (const [max, q] of [
      [1280, 0.82],
      [1024, 0.72],
      [800, 0.62],
      [640, 0.5],
    ] as const) {
      const scale = Math.min(1, max / Math.max(nw, nh));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(nw * scale));
      canvas.height = Math.max(1, Math.round(nh * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser couldn't process the image.");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      out = canvas.toDataURL("image/jpeg", q);
      if (out.length < LIMIT) return out;
    }
    throw new Error(`“${file.name}” is too detailed to upload. Try a smaller image.`);
  } finally {
    URL.revokeObjectURL(url);
  }
}
