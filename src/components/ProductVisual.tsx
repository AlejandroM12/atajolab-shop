import type { Technology, VisualKind } from "@/lib/types";

/**
 * Espacio de fotografía de producto.
 *
 * Mientras no haya fotos propias se muestra una silueta neutra del tipo de objeto
 * (sin códigos QR dibujados ni colores). Cuando un producto define `images[].src`
 * se usa la foto real y este componente deja de mostrarse.
 */

const FILL = "#e4e4e1";
const EDGE = "#b9b9b4";
const DARK = "#8d8d88";

function Silhouette({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "stand":
      // Soporte de acrílico vertical sobre base
      return (
        <g>
          <ellipse cx="200" cy="248" rx="96" ry="9" fill="#000" opacity="0.07" />
          <rect x="132" y="56" width="136" height="176" rx="8" fill={FILL} stroke={EDGE} strokeWidth="2" />
          <rect x="146" y="70" width="108" height="148" rx="4" fill="#f1f1ef" />
          <rect x="116" y="226" width="168" height="16" rx="4" fill={DARK} />
        </g>
      );
    case "menu":
      // Cartel de mesa tipo carpa
      return (
        <g>
          <ellipse cx="200" cy="248" rx="100" ry="9" fill="#000" opacity="0.07" />
          <path d="M140 232 L162 70 L240 70 L262 232 Z" fill={FILL} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
          <path d="M162 70 L240 70 L236 100 L166 100 Z" fill="#d6d6d2" />
        </g>
      );
    case "sign":
      // Cartel horizontal de mostrador
      return (
        <g>
          <ellipse cx="200" cy="236" rx="110" ry="8" fill="#000" opacity="0.07" />
          <rect x="102" y="80" width="196" height="140" rx="8" fill={FILL} stroke={EDGE} strokeWidth="2" />
          <rect x="116" y="94" width="168" height="112" rx="4" fill="#f1f1ef" />
        </g>
      );
    case "sticker":
      return (
        <g>
          <ellipse cx="200" cy="228" rx="70" ry="7" fill="#000" opacity="0.07" />
          <circle cx="200" cy="150" r="72" fill={FILL} stroke={EDGE} strokeWidth="2" />
          <circle cx="200" cy="150" r="52" fill="#f1f1ef" />
        </g>
      );
    case "label":
      return (
        <g>
          <ellipse cx="200" cy="222" rx="90" ry="7" fill="#000" opacity="0.07" />
          <rect x="118" y="96" width="164" height="112" rx="10" fill={FILL} stroke={EDGE} strokeWidth="2" />
          <rect x="132" y="110" width="136" height="84" rx="4" fill="#f1f1ef" />
        </g>
      );
    case "card":
      return (
        <g>
          <ellipse cx="200" cy="232" rx="104" ry="8" fill="#000" opacity="0.07" />
          <rect x="106" y="86" width="188" height="120" rx="10" fill={FILL} stroke={EDGE} strokeWidth="2" transform="rotate(-6 200 146)" />
          <rect x="124" y="108" width="40" height="30" rx="5" fill={DARK} opacity="0.5" transform="rotate(-6 200 146)" />
        </g>
      );
    case "lanyard":
      return (
        <g>
          <ellipse cx="200" cy="262" rx="64" ry="7" fill="#000" opacity="0.07" />
          <path d="M150 20 L192 130 M250 20 L208 130" stroke={DARK} strokeWidth="10" strokeLinecap="round" fill="none" />
          <rect x="196" y="126" width="8" height="14" rx="2" fill={DARK} />
          <rect x="150" y="140" width="100" height="116" rx="8" fill={FILL} stroke={EDGE} strokeWidth="2" />
          <rect x="162" y="152" width="76" height="92" rx="4" fill="#f1f1ef" />
        </g>
      );
    case "badge":
      return (
        <g>
          <ellipse cx="200" cy="262" rx="70" ry="7" fill="#000" opacity="0.07" />
          <rect x="140" y="34" width="120" height="216" rx="10" fill={FILL} stroke={EDGE} strokeWidth="2" />
          <rect x="184" y="46" width="32" height="8" rx="4" fill={DARK} />
          <rect x="152" y="68" width="96" height="170" rx="4" fill="#f1f1ef" />
        </g>
      );
  }
}

export function ProductVisual({
  kind,
  label,
  className = "",
  showTag = true,
}: {
  kind: VisualKind;
  technology?: Technology;
  accent?: string;
  label: string;
  className?: string;
  showTag?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-paper-2 ${className}`}>
      <svg
        viewBox="0 0 400 300"
        {...(label ? { role: "img", "aria-label": `${label} (imagen de referencia)` } : { "aria-hidden": true })}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <Silhouette kind={kind} />
      </svg>
      {showTag && (
        <span className="absolute bottom-1.5 right-2 text-[10px] text-ink-soft">
          Imagen de referencia
        </span>
      )}
    </div>
  );
}
