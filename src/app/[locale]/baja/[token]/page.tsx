import { notFound } from "next/navigation";
import { UnsubscribeForm } from "@/components/forms/SimpleForms";
import { Container, PageHero } from "@/components/ui";
import { loadPublic } from "@/components/site/Shell";
import { prisma } from "@/lib/db";
import { sha256 } from "@/lib/request";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale: localeRaw, token } = await params;
  const loaded = await loadPublic(localeRaw);
  if (!loaded) notFound();
  const subscriber = await prisma.subscriber.findUnique({ where: { unsubTokenHash: sha256(token) } }).catch(() => null);
  return (
    <>
      <PageHero kicker={loaded.dict.forms.subscribe} title={loaded.dict.forms.confirmUnsub} description={subscriber ? loaded.dict.forms.unsubBody : loaded.dict.forms.unsubMissing} />
      <Container className="py-14">
        {subscriber && !subscriber.unsubscribedAt ? (
          <UnsubscribeForm locale={loaded.locale} token={token} label={loaded.dict.forms.confirmUnsub} />
        ) : (
          <p className="rounded-3xl bg-white p-5 ring-1 ring-line">{subscriber ? loaded.dict.forms.unsubscribed : loaded.dict.forms.unsubMissing}</p>
        )}
      </Container>
    </>
  );
}
