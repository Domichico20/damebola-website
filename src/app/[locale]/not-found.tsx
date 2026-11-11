import { headers } from "next/headers";
import Link from "next/link";
import { getDictionary } from "@/content";
import { Container } from "@/components/ui";

export default async function NotFound() {
  const locale = (await headers()).get("x-locale") === "en" ? "en" : "es";
  const dict = getDictionary(locale);
  return (
    <Container className="py-24">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">{dict.notFound.title}</h1>
      <p className="mt-3 max-w-xl text-slate">{dict.notFound.body}</p>
      <Link className="mt-6 inline-flex min-h-12 items-center rounded-full bg-blue-600 px-5 font-semibold text-white" href={locale === "en" ? "/en" : "/"}>{dict.notFound.cta}</Link>
    </Container>
  );
}
