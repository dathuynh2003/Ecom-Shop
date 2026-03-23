import { Pencil, Save, Trash2 } from "lucide-react";
import type { CreateSpecKeyRequest, SpecKeyResponse } from "../../../api/client";

interface SpecKeyManagementTabProps {
    specKeys: SpecKeyResponse[];
    specKeyForm: CreateSpecKeyRequest;
    editingSpecKeyId: number | null;
    onChangeForm: (payload: CreateSpecKeyRequest) => void;
    onSubmit: () => void;
    onReset: () => void;
    onEdit: (specKey: SpecKeyResponse) => void;
    onDelete: (id?: number) => void;
}

function baseInputClassName() {
    return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
}

export function SpecKeyManagementTab({
    specKeys,
    specKeyForm,
    editingSpecKeyId,
    onChangeForm,
    onSubmit,
    onReset,
    onEdit,
    onDelete,
}: SpecKeyManagementTabProps) {
    return (
        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{editingSpecKeyId ? "Cập nhật Spec Key" : "Tạo Spec Key"}</h2>
                <div className="mt-3 space-y-3">
                    <input
                        placeholder="Tên thông số"
                        className={baseInputClassName()}
                        value={specKeyForm.name ?? ""}
                        onChange={(event) => onChangeForm({ ...specKeyForm, name: event.target.value })}
                    />
                    <input
                        placeholder="Đơn vị (vd: GB, inch, W...)"
                        className={baseInputClassName()}
                        value={specKeyForm.unit ?? ""}
                        onChange={(event) => onChangeForm({ ...specKeyForm, unit: event.target.value })}
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
                <h3 className="text-lg font-semibold text-slate-900">Danh sách Spec Key</h3>
                <div className="mt-3 space-y-2">
                    {specKeys.map((specKey) => (
                        <div key={specKey.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                            <div>
                                <p className="text-sm font-medium text-slate-900">{specKey.name}</p>
                                <p className="text-xs text-slate-500">Unit: {specKey.unit || "-"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(specKey)}
                                    className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(specKey.id)}
                                    className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
