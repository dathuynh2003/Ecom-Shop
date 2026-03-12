import { useState } from "react";
import clsx from "clsx";
import type { ProductImage } from "../../../api/client";

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
                Không có hình ảnh
            </div>
        );
    }

    const activeImage = images[activeIndex];

    // Build thumbnail order: all images except active, shown in original order
    const thumbnails = images
        .map((img, idx) => ({ img, idx }))
        .filter(({ idx }) => idx !== activeIndex);

    return (
        <div className="space-y-3">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="aspect-square p-6">
                    <img
                        src={activeImage.imageUrl ?? ""}
                        alt={`Ảnh sản phẩm ${activeIndex + 1}`}
                        className="h-full w-full object-contain transition-opacity duration-300"
                    />
                </div>

                {/* Image counter badge */}
                {images.length > 1 && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {activeIndex + 1} / {images.length}
                    </span>
                )}
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {thumbnails.map(({ img, idx }) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(idx)}
                            className={clsx(
                                "flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all",
                                idx === activeIndex
                                    ? "border-brand-orange ring-2 ring-brand-orange/30"
                                    : "border-slate-200 hover:border-brand-orange/50"
                            )}
                        >
                            <div className="h-16 w-16 p-1.5 sm:h-20 sm:w-20 sm:p-2">
                                <img
                                    src={img.imageUrl ?? ""}
                                    alt={`Ảnh ${idx + 1}`}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
