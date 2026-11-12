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
      <div className="overflow-hidden rounded-lg border border-line bg-paper-2">
        {current?.src ? (
          <div className="relative aspect-[4/3]">
            <Image src={current.src} alt={current.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
            {current.illustrative && (
              <span className="absolute bottom-2 right-2 rounded bg-white/90 px-1.5 py-0.5 text-[11px] text-ink-soft">
                Imagen ilustrativa. El diseño final puede variar.
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
                className={`h-16 w-20 overflow-hidden rounded-md border ${i === index ? "border-ink" : "border-line"}`}
              >
                {img.src ? (
                  <Image src={img.src} alt="" width={160} height={120} className="h-full w-full object-cover" />
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
