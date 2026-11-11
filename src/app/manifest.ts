import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DameBola",
    short_name: "DameBola",
    description: "Tu destino, tu precio.",
    start_url: "/",
    display: "standalone",
    background_color: "#071227",
    theme_color: "#071227",
    lang: "es",
    icons: [{ src: "/brand/logo.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
