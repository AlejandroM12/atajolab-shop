import Link from "next/link";
import { NAV_LINKS, SITE } from "@/data/site";
import { Container } from "./ui";
import { Logo } from "./Logo";

const linkCls = "text-ink-soft hover:text-ink hover:underline";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-2">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            Productos físicos personalizados con QR y NFC para negocios, profesionales y eventos.
            Fabricación por encargo, con base en {SITE.startCity}, Argentina.
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Una unidad de{" "}
            <a className="font-medium text-ink underline" href={SITE.institutionalUrl}>
              AtajoLab
            </a>
            .
          </p>
        </div>
        <nav aria-label="Secciones">
          <h2 className="text-sm font-semibold">Tienda</h2>
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
          <h2 className="text-sm font-semibold">Información</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/preguntas-frecuentes/" className={linkCls}>
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/condiciones-comerciales/" className={linkCls}>
                Condiciones comerciales
              </Link>
            </li>
            <li>
              <Link href="/menu-digital/" className={linkCls}>
                Carta digital (próximamente)
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-line py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} AtajoLab. Imágenes ilustrativas: el diseño final puede variar.
      </div>
    </footer>
  );
}
