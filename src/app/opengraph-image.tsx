import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DameBola. Tu destino, tu precio.";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#071227", color: "white", padding: 64 }}>
        <img src={src} width={280} height={280} alt="" />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 48 }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>Tu destino, tu precio.</div>
          <div style={{ fontSize: 32, marginTop: 16, color: "#8aebff" }}>Un orgullo dominicano en cada viaje.</div>
        </div>
      </div>
    ),
    size,
  );
}
