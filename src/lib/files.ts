import { randomBytes } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "data", "private", "uploads");
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function detectMime(buf: Buffer) {
  if (buf.length >= 5 && buf.subarray(0, 5).toString("utf8") === "%PDF-") return "application/pdf";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString("utf8") === "RIFF" && buf.subarray(8, 12).toString("utf8") === "WEBP") {
    return "image/webp";
  }
  return null;
}

export function extFor(mime: string) {
  if (mime === "application/pdf") return ".pdf";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  return ".webp";
}

export function safeOriginalName(name: string) {
  return name.replace(/[/\\?%*:|"<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 120) || "documento";
}

export async function savePrivateFile(bytes: Buffer, mime: string) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const storedName = `${randomBytes(16).toString("hex")}${extFor(mime)}`;
  await writeFile(path.join(UPLOAD_DIR, storedName), bytes);
  return storedName;
}

export async function removePrivateFile(storedName: string) {
  if (!/^[a-f0-9]{32}\.(pdf|jpg|png|webp)$/.test(storedName)) return;
  await unlink(path.join(UPLOAD_DIR, storedName)).catch(() => undefined);
}
