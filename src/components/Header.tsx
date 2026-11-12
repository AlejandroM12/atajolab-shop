import Link from "next/link";
import { NAV_LINKS } from "@/data/site";
import { CartLink } from "./CartLink";
import { Container } from "./ui";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-paper-2 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CartLink />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
