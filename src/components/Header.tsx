import Link from "next/link";
import { NAV_LINKS } from "@/data/site";
import { CartLink } from "./CartLink";
import { Container } from "./ui";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white ">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink hover:underline underline-offset-8 decoration-brand decoration-2"
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
