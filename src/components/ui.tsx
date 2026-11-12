import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`} {...props} />;
}

export type ButtonVariant = "primary" | "secondary" | "whatsapp" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-ink hover:bg-brand-dark hover:text-white",
  secondary: "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  whatsapp: "bg-[#0f7a40] text-white hover:bg-[#0b5f31]",
  ghost: "text-ink hover:bg-paper-2",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  external = false,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = buttonClass(variant, className);
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "teal" | "muted";
}) {
  const tones = {
    neutral: "bg-paper-2 text-ink",
    brand: "bg-brand/15 text-brand-dark",
    teal: "bg-teal/15 text-teal",
    muted: "bg-ink/10 text-ink-soft",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-dark">
          {eyebrow}
        </p>
      )}
      <Tag className="text-3xl font-bold leading-tight sm:text-4xl">{title}</Tag>
      {children && <p className="mt-3 text-lg text-ink-soft">{children}</p>}
    </div>
  );
}
