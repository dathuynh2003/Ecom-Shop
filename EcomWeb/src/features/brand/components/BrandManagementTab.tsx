import { Pencil, Save, Trash2 } from "lucide-react";
import type { BrandResponse, CreateBrandRequest } from "../../../api/client";

interface BrandManagementTabProps {
    brands: BrandResponse[];
    brandForm: CreateBrandRequest;
    editingBrandId: number | null;
    brandPage: number;
    brandTotalPages: number;
    onChangeForm: (payload: CreateBrandRequest) => void;
    onSubmit: () => void;
    onReset: () => void;
    onEdit: (brand: BrandResponse) => void;
    onDelete: (id?: number) => void;
    onPrevPage: () => void;
    onNextPage: () => void;
}

function baseInputClassName() {
    return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
}

export function BrandManagementTab({
    brands,
    brandForm,
    editingBrandId,
    brandPage,
    brandTotalPages,
    onChangeForm,
    onSubmit,
    onReset,
    onEdit,
    onDelete,
    onPrevPage,
    onNextPage,
}: BrandManagementTabProps) {
    return (
        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{editingBrandId ? "Cập nhật Brand" : "Tạo Brand"}</h2>
                <div className="mt-3 space-y-3">
                    <input
                        placeholder="Tên brand"
                        className={baseInputClassName()}
                        value={brandForm.name ?? ""}
                        onChange={(event) => onChangeForm({ ...brandForm, name: event.target.value })}
                    />
                    <input
                        placeholder="Logo URL"
                        className={baseInputClassName()}
                        value={brandForm.logoUrl ?? ""}
                        onChange={(event) => onChangeForm({ ...brandForm, logoUrl: event.target.value })}
                    />
                    <div className="flex gap-2">
                        <button onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90">
                            <Save className="h-4 w-4" /> Lưu
                        </button>
                        <button onClick={onReset} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Reset</button>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Danh sách Brand</h3>
                <div className="mt-3 space-y-2">
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">{brand.name}</p>
                                <p className="truncate text-xs text-slate-500">{brand.slug || "(no slug)"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(brand)}
                                    className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(brand.id)}
                                    className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                        disabled={brandPage <= 1}
                        onClick={onPrevPage}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-xs text-slate-500">{brandPage}/{brandTotalPages}</span>
                    <button
                        disabled={brandPage >= brandTotalPages}
                        onClick={onNextPage}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}
