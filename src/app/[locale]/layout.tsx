import { notFound } from "next/navigation";
import { Shell } from "@/components/site/Shell";
import { isLocale } from "@/lib/routes";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Shell locale={locale}>{children}</Shell>;
}
