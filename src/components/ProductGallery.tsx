"use client";

import Image from "next/image";
import { useState } from "react";
import type { Technology, VisualKind, ProductImage } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

export function ProductGallery({
  images,
  kind,
  technology,
  accent,
}: {
  images: ProductImage[];
  kind: VisualKind;
  technology: Technology;
  accent: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line">
        {current?.src ? (
          <div className="relative aspect-[4/3]">
            <Image src={current.src} alt={current.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
            {current.illustrative && (
              <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                Imagen ilustrativa
              </span>
            )}
          </div>
        ) : (
          <ProductVisual
            kind={kind}
            technology={technology}
            accent={accent}
            label={current?.alt ?? "Ilustración del producto"}
            className="aspect-[4/3]"
            showTag={current?.illustrative ?? true}
          />
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label="Galería de imágenes">
          {images.map((img, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver imagen ${i + 1}: ${img.alt}`}
                aria-current={i === index}
                className={`h-16 w-20 overflow-hidden rounded-lg border-2 ${i === index ? "border-brand" : "border-line"}`}
              >
                {img.src ? (
                  <Image src={img.src} alt="" width={80} height={64} className="h-full w-full object-cover" />
                ) : (
                  <ProductVisual kind={kind} technology={technology} accent={accent} label="" showTag={false} className="h-full w-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
