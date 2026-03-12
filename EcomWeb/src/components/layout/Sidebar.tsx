import { Link, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import clsx from "clsx";
import { mockCategories, mockBrands } from "./Header";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const [searchParams] = useSearchParams();
    const activeCategory = searchParams.get("category");
    const activeBrand = searchParams.get("brand");

    return (
        <>
            {/* Overlay (mobile/tablet only) */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar-bg shadow-lg transition-transform duration-300 lg:static lg:z-auto lg:w-60 lg:translate-x-0 lg:rounded-xl lg:shadow-none lg:transition-none",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3 lg:hidden">
                    <span className="text-sm font-semibold text-slate-900">
                        Bộ lọc
                    </span>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                        aria-label="Đóng"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-6">
                    {/* Categories */}
                    <div>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                            Danh mục sản phẩm
                        </h3>
                        <ul className="space-y-0.5">
                            <li>
                                <Link
                                    to="/"
                                    onClick={onClose}
                                    className={clsx(
                                        "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                                        !activeCategory
                                            ? "bg-brand-orange/10 font-medium text-brand-brown"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    Tất cả
                                </Link>
                            </li>
                            {mockCategories.map((c) => (
                                <li key={c.id}>
                                    <Link
                                        to={`/products?category=${c.id}`}
                                        onClick={onClose}
                                        className={clsx(
                                            "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                                            activeCategory === String(c.id)
                                                ? "bg-brand-orange/10 font-medium text-brand-brown"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Brands */}
                    <div>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                            Thương hiệu
                        </h3>
                        <ul className="space-y-0.5">
                            {mockBrands.map((b) => (
                                <li key={b.id}>
                                    <Link
                                        to={`/products?brand=${b.id}`}
                                        onClick={onClose}
                                        className={clsx(
                                            "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                                            activeBrand === String(b.id)
                                                ? "bg-brand-orange/10 font-medium text-brand-brown"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        {b.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
}
