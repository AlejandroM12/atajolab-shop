import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-display text-lg font-bold"
      aria-label="AtajoLab Shop, ir al inicio"
    >
      <span
        aria-hidden
        className="grid h-9 w-9 grid-cols-2 gap-[3px] rounded-lg bg-brand p-1.5"
      >
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-white/40" />
        <span className="rounded-[2px] bg-white/40" />
        <span className="rounded-[2px] bg-white" />
      </span>
      <span className={light ? "text-white" : "text-ink"}>
        AtajoLab <span className="text-brand">Shop</span>
      </span>
    </Link>
  );
}
