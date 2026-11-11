import { readFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { UPLOAD_DIR } from "@/lib/files";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new Response("No autorizado", { status: 401 });
  const { id } = await context.params;
  const document = await prisma.applicationDocument.findUnique({ where: { id } });
  if (!document || !/^[a-f0-9]{32}\.(pdf|jpg|png|webp)$/.test(document.storedName)) {
    return new Response("No encontrado", { status: 404 });
  }
  const bytes = await readFile(path.join(UPLOAD_DIR, document.storedName));
  const preview = new URL(request.url).searchParams.get("view") === "1";
  if (!preview) {
    await writeAudit({ actorId: session.id, action: "document_download", entityType: "document", entityId: document.id });
  }
  const filename = document.originalName.replace(/["\r\n]/g, "");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
