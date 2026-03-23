import { Plus, Save } from "lucide-react";
import type { CategoryResponse, SpecKeyResponse } from "../../../api/client";

type SchemaItem = {
    specificationKeyId: number;
    displayOrder: number;
};

interface CategorySpecSchemaTabProps {
    categoryOptions: CategoryResponse[];
    specKeys: SpecKeyResponse[];
    selectedCategoryIdForSchema: number | null;
    schemaItems: SchemaItem[];
    onSelectCategory: (categoryId: number | null) => void;
    onAddSchemaItem: () => void;
    onSaveSchema: () => void;
    onUpdateSchemaItem: (index: number, payload: SchemaItem) => void;
    onRemoveSchemaItem: (index: number) => void;
}

function baseInputClassName() {
    return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
}

export function CategorySpecSchemaTab({
    categoryOptions,
    specKeys,
    selectedCategoryIdForSchema,
    schemaItems,
    onSelectCategory,
    onAddSchemaItem,
    onSaveSchema,
    onUpdateSchemaItem,
    onRemoveSchemaItem,
}: CategorySpecSchemaTabProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[300px_1fr_auto]">
                <select
                    className={baseInputClassName()}
                    value={selectedCategoryIdForSchema ?? ""}
                    onChange={(event) => {
                        const value = Number(event.target.value);
                        onSelectCategory(value || null);
                    }}
                >
                    <option value="">Chọn category</option>
                    {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button
                    onClick={onAddSchemaItem}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    <Plus className="h-4 w-4" /> Thêm dòng schema
                </button>
                <button
                    onClick={onSaveSchema}
                    disabled={!selectedCategoryIdForSchema}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-brand-brown disabled:opacity-50"
                >
                    <Save className="h-4 w-4" /> Lưu schema
                </button>
            </div>

            <div className="mt-4 space-y-2">
                {schemaItems.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                        Chưa có spec schema cho category này.
                    </p>
                )}

                {schemaItems.map((schemaItem, index) => (
                    <div key={`${schemaItem.specificationKeyId}-${index}`} className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_160px_auto]">
                        <select
                            className={baseInputClassName()}
                            value={schemaItem.specificationKeyId}
                            onChange={(event) => {
                                const next = Number(event.target.value);
                                onUpdateSchemaItem(index, { ...schemaItem, specificationKeyId: next });
                            }}
                        >
                            <option value={0}>Chọn spec key</option>
                            {specKeys.map((specKey) => (
                                <option key={specKey.id} value={specKey.id}>{specKey.name}</option>
                            ))}
                        </select>
                        <input
                            className={baseInputClassName()}
                            type="number"
                            min={0}
                            value={schemaItem.displayOrder}
                            onChange={(event) => {
                                const next = Number(event.target.value || 0);
                                onUpdateSchemaItem(index, { ...schemaItem, displayOrder: next });
                            }}
                        />
                        <button
                            onClick={() => onRemoveSchemaItem(index)}
                            className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Xóa
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
