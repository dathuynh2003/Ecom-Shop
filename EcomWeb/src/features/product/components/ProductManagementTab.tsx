import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { BrandResponse, CategoryResponse, ProductResponse, SpecKeyResponse } from "../../../api/client";

type ProductForm = {
    name: string;
    description: string;
    price: string;
    stockQuantity: string;
    categoryId: string;
    brandId: string;
    imageUrls: string;
};

type ProductSpecFormItem = {
    specificationKeyId: number;
    value: string;
};

interface ProductManagementTabProps {
    products: ProductResponse[];
    productForm: ProductForm;
    productSpecs: ProductSpecFormItem[];
    editingProductId: number | null;
    productPage: number;
    productTotalPages: number;
    categoryOptions: CategoryResponse[];
    brandOptions: BrandResponse[];
    specKeys: SpecKeyResponse[];
    onChangeForm: (payload: ProductForm) => void;
    onChangeSpec: (index: number, payload: ProductSpecFormItem) => void;
    onAddSpec: () => void;
    onRemoveSpec: (index: number) => void;
    onSubmit: () => void;
    onReset: () => void;
    onEdit: (product: ProductResponse) => void;
    onDelete: (id?: number) => void;
    onPrevPage: () => void;
    onNextPage: () => void;
}

function baseInputClassName() {
    return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
}

function formatCurrency(value?: number) {
    if (typeof value !== "number") return "—";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export function ProductManagementTab({
    products,
    productForm,
    productSpecs,
    editingProductId,
    productPage,
    productTotalPages,
    categoryOptions,
    brandOptions,
    specKeys,
    onChangeForm,
    onChangeSpec,
    onAddSpec,
    onRemoveSpec,
    onSubmit,
    onReset,
    onEdit,
    onDelete,
    onPrevPage,
    onNextPage,
}: ProductManagementTabProps) {
    return (
        <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{editingProductId ? "Cập nhật Product" : "Tạo Product"}</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input
                        className={baseInputClassName()}
                        placeholder="Tên product"
                        value={productForm.name}
                        onChange={(event) => onChangeForm({ ...productForm, name: event.target.value })}
                    />
                    <input
                        className={baseInputClassName()}
                        placeholder="Giá"
                        type="number"
                        min={0}
                        value={productForm.price}
                        onChange={(event) => onChangeForm({ ...productForm, price: event.target.value })}
                    />
                    <input
                        className={baseInputClassName()}
                        placeholder="Số lượng tồn"
                        type="number"
                        min={0}
                        value={productForm.stockQuantity}
                        onChange={(event) => onChangeForm({ ...productForm, stockQuantity: event.target.value })}
                    />
                    <select
                        className={baseInputClassName()}
                        value={productForm.categoryId}
                        onChange={(event) => onChangeForm({ ...productForm, categoryId: event.target.value })}
                    >
                        <option value="">Chọn category</option>
                        {categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <select
                        className={baseInputClassName()}
                        value={productForm.brandId}
                        onChange={(event) => onChangeForm({ ...productForm, brandId: event.target.value })}
                    >
                        <option value="">Chọn brand</option>
                        {brandOptions.map((brand) => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                    <textarea
                        className={baseInputClassName()}
                        placeholder="Mô tả"
                        rows={3}
                        value={productForm.description}
                        onChange={(event) => onChangeForm({ ...productForm, description: event.target.value })}
                    />
                </div>

                {!editingProductId && (
                    <>
                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <textarea
                                className={baseInputClassName()}
                                rows={4}
                                placeholder="Mỗi dòng là 1 image URL (dòng đầu tiên sẽ là ảnh primary)"
                                value={productForm.imageUrls}
                                onChange={(event) => onChangeForm({ ...productForm, imageUrls: event.target.value })}
                            />
                            <div className="rounded-xl border border-slate-200 p-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-700">Thông số sản phẩm</p>
                                    <button
                                        onClick={onAddSpec}
                                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Thêm
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {productSpecs.map((productSpec, index) => (
                                        <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                                            <select
                                                className={baseInputClassName()}
                                                value={productSpec.specificationKeyId}
                                                onChange={(event) => {
                                                    const next = Number(event.target.value || 0);
                                                    onChangeSpec(index, { ...productSpec, specificationKeyId: next });
                                                }}
                                            >
                                                <option value={0}>Spec key</option>
                                                {specKeys.map((specKey) => (
                                                    <option key={specKey.id} value={specKey.id}>{specKey.name}</option>
                                                ))}
                                            </select>
                                            <input
                                                className={baseInputClassName()}
                                                placeholder="Giá trị"
                                                value={productSpec.value}
                                                onChange={(event) => onChangeSpec(index, { ...productSpec, value: event.target.value })}
                                            />
                                            <button
                                                onClick={() => onRemoveSpec(index)}
                                                className="rounded-md border border-red-200 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Lưu ý: API update product hiện chỉ hỗ trợ trường cơ bản, ảnh và thông số dùng ở bước tạo mới.</p>
                    </>
                )}

                <div className="mt-3 flex gap-2">
                    <button onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90">
                        <Save className="h-4 w-4" /> Lưu Product
                    </button>
                    <button onClick={onReset} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Reset</button>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Danh sách Product</h3>
                <div className="mt-3 space-y-2">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                                <p className="truncate text-xs text-slate-500">{product.categoryName} • {product.brandName} • {formatCurrency(product.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
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
                        disabled={productPage <= 1}
                        onClick={onPrevPage}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-xs text-slate-500">{productPage}/{productTotalPages}</span>
                    <button
                        disabled={productPage >= productTotalPages}
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
