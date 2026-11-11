import QRCode from "qrcode";
import { Secret, TOTP } from "otpauth";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { beginTotp } from "@/server/admin";
import { PasswordForm, TotpConfirmForm, TotpDisableForm } from "@/components/admin/AccountForms";

export default async function Page({ searchParams }: { searchParams: Promise<{ cambio?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const query = await searchParams;
  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user) redirect("/admin/login");
  let qr = "";
  if (user.totpSecret && !user.totpEnabled) {
    const totp = new TOTP({
      issuer: "DameBola",
      label: user.email,
      secret: Secret.fromBase32(user.totpSecret),
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });
    qr = await QRCode.toDataURL(totp.toString());
  }
  return (
    <div className="grid max-w-3xl gap-4">
      <h1 className="font-display text-3xl font-semibold">Cuenta</h1>
      {query.cambio ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm">Debes cambiar la contraseña temporal antes de continuar.</p> : null}
      <PasswordForm />
      <section className="rounded-3xl bg-white p-5 ring-1 ring-line">
        <h2 className="font-semibold">Doble factor</h2>
        <p className="mt-1 text-sm text-slate">Estado: {user.totpEnabled ? "activo" : "inactivo"}.</p>
        {!user.totpEnabled ? (
          <form action={beginTotp} className="mt-3">
            <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Generar código QR</button>
          </form>
        ) : <div className="mt-3"><TotpDisableForm /></div>}
        {qr ? (
          <div className="mt-4">
            <img src={qr} alt="Código QR para configurar el doble factor" width={180} height={180} />
            <p className="mt-2 break-all text-xs text-slate">Clave manual: {user.totpSecret}</p>
            <TotpConfirmForm />
          </div>
        ) : null}
      </section>
    </div>
  );
}
