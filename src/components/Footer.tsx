import Link from "next/link";
import { NAV_LINKS, SITE } from "@/data/site";
import { Container } from "./ui";
import { Logo } from "./Logo";

const linkCls = "hover:text-white hover:underline";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Productos físicos personalizados con QR y NFC para negocios, profesionales y eventos.
            Fabricación por encargo, con base en {SITE.startCity}, Argentina.
          </p>
          <p className="mt-4 text-sm">
            Una unidad de{" "}
            <a className="font-semibold text-white underline" href={SITE.institutionalUrl}>
              AtajoLab
            </a>
            .
          </p>
        </div>
        <nav aria-label="Secciones">
          <h2 className="font-display text-base font-bold text-white">Tienda</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/pedido/" className={linkCls}>
                Mi pedido
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Información">
          <h2 className="font-display text-base font-bold text-white">Información</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/condiciones-comerciales/" className={linkCls}>
                Condiciones comerciales
              </Link>
            </li>
            <li>
              <Link href="/menu-digital/" className={linkCls}>
                Menú digital (próximamente)
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} AtajoLab. Las imágenes de productos son ilustrativas.
      </div>
    </footer>
  );
}
