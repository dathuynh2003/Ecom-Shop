import { useEffect, useMemo, useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import type { CategoryResponse, CreateCategoryRequest } from "../../../api/client";

interface CategoryManagementTabProps {
    categories: CategoryResponse[];
    categoryForm: CreateCategoryRequest;
    editingCategoryId: number | null;
    isLoading: boolean;
    isMutating: boolean;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    onChangeForm: (payload: CreateCategoryRequest) => void;
    onSubmit: () => void;
    onReset: () => void;
    onEdit: (category: CategoryResponse) => void;
    onDelete: (id?: number) => void;
    onChangePage: (pageIndex: number) => void;
    onChangePageSize: (pageSize: number) => void;
}

function baseInputClassName() {
    return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
}

export function CategoryManagementTab({
    categories,
    categoryForm,
    editingCategoryId,
    isLoading,
    isMutating,
    pageIndex,
    pageSize,
    totalPages,
    totalItems,
    onChangeForm,
    onSubmit,
    onReset,
    onEdit,
    onDelete,
    onChangePage,
    onChangePageSize,
}: CategoryManagementTabProps) {
    const [pageSizeInput, setPageSizeInput] = useState(String(pageSize));

    useEffect(() => {
        setPageSizeInput(String(pageSize));
    }, [pageSize]);

    const visiblePages = useMemo(() => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }
        if (pageIndex <= 2) {
            return [1, 2, 3];
        }
        if (pageIndex >= totalPages - 1) {
            return [totalPages - 2, totalPages - 1, totalPages];
        }
        return [pageIndex - 1, pageIndex, pageIndex + 1];
    }, [pageIndex, totalPages]);

    const applyPageSize = () => {
        const next = Number(pageSizeInput);
        if (!Number.isFinite(next) || next <= 0) {
            setPageSizeInput(String(pageSize));
            return;
        }
        onChangePageSize(next);
    };

    return (
        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{editingCategoryId ? "Cập nhật Category" : "Tạo Category"}</h2>
                <div className="mt-3 space-y-3">
                    <input
                        placeholder="Tên category"
                        className={baseInputClassName()}
                        value={categoryForm.name ?? ""}
                        onChange={(event) => onChangeForm({ ...categoryForm, name: event.target.value })}
                    />
                    <textarea
                        placeholder="Mô tả"
                        className={baseInputClassName()}
                        rows={3}
                        value={categoryForm.description ?? ""}
                        onChange={(event) => onChangeForm({ ...categoryForm, description: event.target.value })}
                    />
                    <div className="flex gap-2">
                        <button type="button" onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90">
                            <Save className="h-4 w-4" /> Lưu
                        </button>
                        <button type="button" onClick={onReset} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Reset</button>
                    </div>
                    {isMutating && <p className="text-xs text-slate-500">Đang cập nhật dữ liệu...</p>}
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Danh sách Category</h3>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-xs text-slate-600">Tổng: <span className="font-semibold">{totalItems}</span> mục</div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span>Page size</span>
                        <input
                            type="number"
                            min={1}
                            className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none"
                            value={pageSizeInput}
                            onChange={(event) => setPageSizeInput(event.target.value)}
                            onBlur={applyPageSize}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    applyPageSize();
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="mt-3 space-y-2">
                    {isLoading && <p className="text-sm text-slate-500">Đang tải danh mục...</p>}
                    {!isLoading && categories.length === 0 && <p className="text-sm text-slate-500">Chưa có category nào.</p>}
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">{category.name}</p>
                                <p className="truncate text-xs text-slate-500">{category.slug || "(no slug)"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit(category)}
                                    className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(category.id)}
                                    className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        disabled={pageIndex <= 1}
                        onClick={() => onChangePage(pageIndex - 1)}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {visiblePages[0] > 1 && <span className="px-2 text-xs text-slate-400">...</span>}

                    {visiblePages.map((page) => (
                        <button
                            type="button"
                            key={page}
                            onClick={() => onChangePage(page)}
                            className={`rounded-md px-2.5 py-1.5 text-xs ${
                                page === pageIndex
                                    ? "bg-brand-orange/20 font-semibold text-brand-brown"
                                    : "border border-slate-300 text-slate-600"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages && <span className="px-2 text-xs text-slate-400">...</span>}

                    <button
                        type="button"
                        disabled={pageIndex >= totalPages}
                        onClick={() => onChangePage(pageIndex + 1)}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}
