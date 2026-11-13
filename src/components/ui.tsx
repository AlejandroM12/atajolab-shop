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
  primary: "bg-brand text-on-brand hover:bg-ink hover:text-on-ink",
  secondary: "border border-ink/80 bg-surface text-ink hover:bg-ink hover:text-on-ink",
  whatsapp: "bg-[#0f7a40] text-white hover:bg-[#0b5f31]",
  ghost: "text-ink hover:bg-paper-2",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${extra}`;
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
    neutral: "bg-paper-2 text-ink-soft",
    brand: "bg-paper-2 text-ink-soft",
    teal: "bg-paper-2 text-ink-soft",
    muted: "bg-paper-2 text-ink-soft",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
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
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
          {eyebrow}
        </p>
      )}
      <Tag className="text-2xl font-semibold leading-tight sm:text-3xl">{title}</Tag>
      {children && <p className="mt-2 text-base text-ink-soft">{children}</p>}
    </div>
  );
}
