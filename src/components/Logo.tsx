import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-[17px] font-semibold tracking-tight"
      aria-label="AtajoLab Shop, ir al inicio"
    >
      <span
        aria-hidden
        className="grid h-7 w-7 grid-cols-2 gap-[3px] rounded-md bg-brand p-1.5"
      >
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-white/40" />
        <span className="rounded-[2px] bg-white/40" />
        <span className="rounded-[2px] bg-white" />
      </span>
      <span className={light ? "text-white" : "text-ink"}>
        AtajoLab <span className={light ? "text-brand" : "text-brand-dark"}>Shop</span>
      </span>
    </Link>
  );
}
