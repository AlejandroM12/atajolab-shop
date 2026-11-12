import type { Technology, VisualKind } from "@/lib/types";

const INK = "#0e1a2b";

/** Patrón decorativo con apariencia de QR (no es escaneable). */
const PATTERN = [
  "1011010",
  "0100101",
  "1101110",
  "0010011",
  "1110100",
  "0101011",
  "1001101",
];

function QrGlyph({ x, y, size }: { x: number; y: number; size: number }) {
  const n = 11;
  const c = size / n;
  const cells: React.ReactElement[] = [];
  const finder = (fx: number, fy: number, key: string) => (
    <g key={key}>
      <rect x={x + fx * c} y={y + fy * c} width={3 * c} height={3 * c} fill={INK} />
      <rect x={x + (fx + 0.6) * c} y={y + (fy + 0.6) * c} width={1.8 * c} height={1.8 * c} fill="#fff" />
      <rect x={x + (fx + 1.05) * c} y={y + (fy + 1.05) * c} width={0.9 * c} height={0.9 * c} fill={INK} />
    </g>
  );
  for (let r = 0; r < n; r++) {
    for (let col = 0; col < n; col++) {
      const inFinder = (r < 4 && col < 4) || (r < 4 && col > n - 5) || (r > n - 5 && col < 4);
      if (inFinder) continue;
      if (PATTERN[r % 7][col % 7] === "1") {
        cells.push(
          <rect key={`${r}-${col}`} x={x + col * c} y={y + r * c} width={c * 0.92} height={c * 0.92} fill={INK} />,
        );
      }
    }
  }
  return (
    <g>
      <rect x={x - c * 0.6} y={y - c * 0.6} width={size + c * 1.2} height={size + c * 1.2} rx={c * 0.6} fill="#fff" />
      {finder(0, 0, "f1")}
      {finder(n - 3, 0, "f2")}
      {finder(0, n - 3, "f3")}
      {cells}
    </g>
  );
}

function NfcWaves({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" transform={`translate(${x} ${y})`}>
      <path d="M0 -10 q12 10 0 20" />
      <path d="M12 -20 q22 20 0 40" />
      <path d="M24 -30 q32 30 0 60" />
    </g>
  );
}

function Lines({ x, y, w, color = INK }: { x: number; y: number; w: number; color?: string }) {
  return (
    <g fill={color} opacity="0.75">
      <rect x={x} y={y} width={w} height="8" rx="4" />
      <rect x={x} y={y + 16} width={w * 0.7} height="8" rx="4" />
    </g>
  );
}

function Scene({ kind, accent }: { kind: VisualKind; accent: string }) {
  switch (kind) {
    case "stand":
      return (
        <g>
          <ellipse cx="200" cy="262" rx="110" ry="14" fill={INK} opacity="0.12" />
          <path d="M120 250 L280 250 L262 226 L138 226 Z" fill={INK} />
          <rect x="112" y="48" width="176" height="186" rx="16" fill={accent} />
          <rect x="112" y="48" width="176" height="186" rx="16" fill="none" stroke={INK} strokeWidth="4" />
          <QrGlyph x={148} y={84} size={104} />
          <rect x="146" y="204" width="108" height="9" rx="4.5" fill="#fff" />
        </g>
      );
    case "menu":
      return (
        <g>
          <ellipse cx="200" cy="258" rx="120" ry="12" fill={INK} opacity="0.12" />
          <path d="M110 250 L200 70 L290 250 Z" fill={accent} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <QrGlyph x={168} y={146} size={64} />
          <Lines x={166} y={214} w={68} color="#fff" />
          <circle cx="200" cy="100" r="10" fill="#fff" />
        </g>
      );
    case "sticker":
      return (
        <g>
          <ellipse cx="200" cy="262" rx="90" ry="10" fill={INK} opacity="0.1" />
          <circle cx="200" cy="150" r="104" fill={accent} stroke={INK} strokeWidth="4" />
          <circle cx="200" cy="150" r="88" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="4 8" />
          <QrGlyph x={156} y={106} size={88} />
          <path d="M268 60 q30 6 50 34 q-34 -4 -50 -34z" fill="#fff" opacity="0.8" />
        </g>
      );
    case "label":
      return (
        <g>
          <ellipse cx="200" cy="248" rx="130" ry="10" fill={INK} opacity="0.1" />
          <rect x="82" y="86" width="236" height="140" rx="18" fill={accent} stroke={INK} strokeWidth="4" />
          <QrGlyph x={106} y={112} size={88} />
          <Lines x={216} y={124} w={80} color="#fff" />
          <rect x="216" y="172" width="70" height="26" rx="13" fill="#fff" />
        </g>
      );
    case "card":
      return (
        <g>
          <ellipse cx="200" cy="262" rx="130" ry="10" fill={INK} opacity="0.1" />
          <g transform="rotate(-6 200 150)">
            <rect x="72" y="76" width="256" height="156" rx="16" fill="#fff" stroke={INK} strokeWidth="4" />
            <rect x="72" y="76" width="256" height="40" rx="16" fill={accent} />
            <rect x="72" y="96" width="256" height="20" fill={accent} />
            <QrGlyph x={226} y={130} size={76} />
            <Lines x={96} y={140} w={96} />
            <rect x="96" y="190" width="70" height="8" rx="4" fill={accent} />
          </g>
        </g>
      );
    case "sign":
      return (
        <g>
          <ellipse cx="200" cy="262" rx="110" ry="10" fill={INK} opacity="0.1" />
          <rect x="188" y="226" width="24" height="30" fill={INK} />
          <rect x="132" y="252" width="136" height="10" rx="5" fill={INK} />
          <rect x="76" y="40" width="248" height="190" rx="14" fill="#fff" stroke={INK} strokeWidth="4" />
          <rect x="76" y="40" width="248" height="44" rx="14" fill={accent} />
          <rect x="76" y="66" width="248" height="18" fill={accent} />
          <rect x="102" y="54" width="110" height="10" rx="5" fill="#fff" />
          <QrGlyph x={112} y={108} size={100} />
          <Lines x={236} y={128} w={64} />
          <rect x="236" y="176" width="60" height="22" rx="11" fill={accent} />
        </g>
      );
    case "lanyard":
      return (
        <g>
          <path d="M140 0 L190 118 M260 0 L210 118" stroke={accent} strokeWidth="16" />
          <rect x="196" y="104" width="8" height="16" rx="2" fill={INK} />
          <rect x="116" y="120" width="168" height="150" rx="14" fill="#fff" stroke={INK} strokeWidth="4" />
          <rect x="184" y="130" width="32" height="8" rx="4" fill={INK} opacity="0.3" />
          <QrGlyph x={156} y={158} size={88} />
        </g>
      );
    case "badge":
      return (
        <g>
          <rect x="116" y="30" width="168" height="230" rx="16" fill="#fff" stroke={INK} strokeWidth="4" />
          <rect x="116" y="30" width="168" height="54" rx="16" fill={accent} />
          <rect x="116" y="62" width="168" height="22" fill={accent} />
          <rect x="176" y="42" width="48" height="10" rx="5" fill="#fff" />
          <circle cx="200" cy="112" r="16" fill={accent} opacity="0.35" />
          <QrGlyph x={162} y={146} size={76} />
          <Lines x={150} y={238} w={100} />
        </g>
      );
  }
}

export function ProductVisual({
  kind,
  technology,
  accent,
  label,
  className = "",
  showTag = true,
}: {
  kind: VisualKind;
  technology: Technology;
  accent: string;
  label: string;
  className?: string;
  showTag?: boolean;
}) {
  const hasNfc = technology !== "qr";
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: `color-mix(in srgb, ${accent} 14%, #faf7f2)` }}
    >
      <svg viewBox="0 0 400 300" role="img" aria-label={label} className="h-full w-full">
        <circle cx="340" cy="46" r="70" fill={accent} opacity="0.12" />
        <circle cx="50" cy="270" r="54" fill={accent} opacity="0.12" />
        <Scene kind={kind} accent={accent} />
        {hasNfc && <NfcWaves x={322} y={70} color={INK} />}
      </svg>
      {showTag && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
          Imagen ilustrativa
        </span>
      )}
    </div>
  );
}
