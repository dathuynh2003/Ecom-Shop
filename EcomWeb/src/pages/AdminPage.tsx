import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Boxes, FolderTree, Package, RefreshCcw, Ruler, Sparkles } from "lucide-react";
import {
    BrandsService,
    ProductsService,
    SpecificationKeysService,
    type BrandResponse,
    type CreateBrandRequest,
    type CreateCategoryRequest,
    type CreateProductRequest,
    type CreateSpecKeyRequest,
    type ProductResponse,
    type ProductSpecificationRequest,
    type SpecKeyResponse,
    type UpdateBrandRequest,
    type UpdateCategorySpecSchemaRequest,
    type UpdateProductRequest,
    type UpdateSpecKeyRequest,
} from "../api/client";
import { CategoriesService } from "../api/client/services/CategoriesService";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AdminDashboardTab } from "../features/admin/components/AdminDashboardTab";
import { BrandManagementTab } from "../features/brand/components/BrandManagementTab";
import { CategoryManagementTab } from "../features/category/components/CategoryManagementTab";
import {
    createCategoryThunk,
    deleteCategoryThunk,
    fetchAllCategoriesThunk,
    updateCategoryThunk,
} from "../features/category/thunks";
import { selectAllCachedCategories, selectCategoryCurrentPageItems, setCategoryPagination } from "../features/category/slices/categorySlice";
import { ProductManagementTab } from "../features/product/components/ProductManagementTab";
import { CategorySpecSchemaTab } from "../features/specification/components/CategorySpecSchemaTab";
import { SpecKeyManagementTab } from "../features/specification/components/SpecKeyManagementTab";

type AdminTab = "dashboard" | "brands" | "categories" | "spec-keys" | "spec-schema" | "products";

type ProductSpecFormItem = {
    specificationKeyId: number;
    value: string;
};

const TABS: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "brands", label: "Brands", icon: <Boxes className="h-4 w-4" /> },
    { key: "categories", label: "Categories", icon: <FolderTree className="h-4 w-4" /> },
    { key: "spec-keys", label: "Spec Keys", icon: <Ruler className="h-4 w-4" /> },
    { key: "spec-schema", label: "Category Spec Schema", icon: <Sparkles className="h-4 w-4" /> },
    { key: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
];

function getApiMessage(error: unknown) {
    if (typeof error === "object" && error && "body" in error) {
        const body = (error as { body?: { detail?: string; title?: string } }).body;
        return body?.detail || body?.title || "Yêu cầu thất bại";
    }
    return "Yêu cầu thất bại";
}

function parseLinesToUrls(text: string) {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export default function AdminPage() {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategoryCurrentPageItems);
    const allCachedCategories = useAppSelector(selectAllCachedCategories);
    const {
        isLoading: isCategoryLoading,
        isMutating: isCategoryMutating,
        pageIndex: categoryPageIndex,
        pageSize: categoryPageSize,
        totalPages: categoryTotalPages,
        totalItems: categoryTotalItems,
    } = useAppSelector((state) => state.category);

    const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
    const [globalLoading, setGlobalLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const [dashboardStats, setDashboardStats] = useState({ brands: 0, categories: 0, specKeys: 0, products: 0 });

    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [brandPage, setBrandPage] = useState(1);
    const [brandPageSize] = useState(8);
    const [brandTotalPages, setBrandTotalPages] = useState(1);
    const [brandForm, setBrandForm] = useState<CreateBrandRequest>({ name: "", logoUrl: "" });
    const [editingBrandId, setEditingBrandId] = useState<number | null>(null);

    const [categoryForm, setCategoryForm] = useState<CreateCategoryRequest>({ name: "", description: "" });
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    const [specKeys, setSpecKeys] = useState<SpecKeyResponse[]>([]);
    const [specKeyForm, setSpecKeyForm] = useState<CreateSpecKeyRequest>({ name: "", unit: "" });
    const [editingSpecKeyId, setEditingSpecKeyId] = useState<number | null>(null);

    const [selectedCategoryIdForSchema, setSelectedCategoryIdForSchema] = useState<number | null>(null);
    const [schemaItems, setSchemaItems] = useState<Array<{ specificationKeyId: number; displayOrder: number }>>([]);

    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [productPage, setProductPage] = useState(1);
    const [productPageSize] = useState(8);
    const [productTotalPages, setProductTotalPages] = useState(1);
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
        brandId: "",
        imageUrls: "",
    });
    const [productSpecs, setProductSpecs] = useState<ProductSpecFormItem[]>([]);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    const clearFeedback = () => {
        setTimeout(() => setFeedback(null), 2800);
    };

    const showSuccess = (message: string) => {
        setFeedback({ type: "success", message });
        clearFeedback();
    };

    const showError = (error: unknown) => {
        setFeedback({ type: "error", message: getApiMessage(error) });
        clearFeedback();
    };

    const loadDashboard = useCallback(async () => {
        try {
            const [brandRes, productRes, specKeyRes] = await Promise.all([
                BrandsService.getApiV1Brands(1, 1),
                ProductsService.getApiV1Products(1, 1),
                SpecificationKeysService.getApiV1SpecificationKeys(),
            ]);

            setDashboardStats({
                brands: brandRes.data?.totalItems ?? 0,
                categories: categoryTotalItems,
                products: productRes.data?.totalItems ?? 0,
                specKeys: specKeyRes.data?.length ?? 0,
            });
        } catch {
            setDashboardStats((prev) => prev);
        }
    }, [categoryTotalItems]);

    useEffect(() => {
        setDashboardStats((prev) => ({ ...prev, categories: categoryTotalItems }));
    }, [categoryTotalItems]);

    const loadBrands = useCallback(async (pageIndex: number) => {
        try {
            const response = await BrandsService.getApiV1Brands(pageIndex, brandPageSize);
            setBrands(response.data?.items ?? []);
            setBrandPage(response.data?.pageNumber ?? pageIndex);
            setBrandTotalPages(response.data?.totalPages ?? 1);
        } catch (error) {
            showError(error);
        }
    }, [brandPageSize]);

    const loadCategories = useCallback(async (pageIndex: number, pageSize: number, force = false) => {
        dispatch(setCategoryPagination({ pageIndex, pageSize }));
        try {
            await dispatch(fetchAllCategoriesThunk({ force })).unwrap();
        } catch (error) {
            showError(error);
        }
    }, [dispatch]);

    const loadSpecKeys = useCallback(async () => {
        try {
            const response = await SpecificationKeysService.getApiV1SpecificationKeys();
            setSpecKeys(response.data ?? []);
        } catch (error) {
            showError(error);
        }
    }, []);

    const loadProducts = useCallback(async (pageIndex: number) => {
        try {
            const response = await ProductsService.getApiV1Products(pageIndex, productPageSize);
            setProducts(response.data?.items ?? []);
            setProductPage(response.data?.pageNumber ?? pageIndex);
            setProductTotalPages(response.data?.totalPages ?? 1);
        } catch (error) {
            showError(error);
        }
    }, [productPageSize]);

    const loadCategorySpecSchema = useCallback(async (categoryId: number) => {
        try {
            const response = await CategoriesService.getApiV1CategoriesSpecificationSchema(categoryId);
            const mapped = (response.data?.items ?? []).map((item) => ({
                specificationKeyId: item.specificationKeyId ?? 0,
                displayOrder: item.displayOrder ?? 0,
            })).filter((item) => item.specificationKeyId > 0);
            setSchemaItems(mapped);
        } catch (error) {
            showError(error);
            setSchemaItems([]);
        }
    }, []);

    const reloadAll = useCallback(async () => {
        setGlobalLoading(true);
        try {
            await Promise.all([loadBrands(1), loadCategories(1, categoryPageSize, true), loadSpecKeys(), loadProducts(1), loadDashboard()]);
        } finally {
            setGlobalLoading(false);
        }
    }, [loadBrands, loadCategories, loadSpecKeys, loadProducts, loadDashboard, categoryPageSize]);

    useEffect(() => {
        if (activeTab === "categories") {
            void loadCategories(categoryPageIndex, categoryPageSize);
        }
    }, [activeTab, categoryPageIndex, categoryPageSize, loadCategories]);

    useEffect(() => {
        void reloadAll();
    }, [reloadAll]);

    const categoryOptions = useMemo(() => allCachedCategories.filter((category) => !!category.id), [allCachedCategories]);
    const brandOptions = useMemo(() => brands.filter((brand) => !!brand.id), [brands]);

    const resetBrandForm = () => {
        setBrandForm({ name: "", logoUrl: "" });
        setEditingBrandId(null);
    };

    const resetCategoryForm = () => {
        setCategoryForm({ name: "", description: "" });
        setEditingCategoryId(null);
    };

    const resetSpecKeyForm = () => {
        setSpecKeyForm({ name: "", unit: "" });
        setEditingSpecKeyId(null);
    };

    const resetProductForm = () => {
        setProductForm({
            name: "",
            description: "",
            price: "",
            stockQuantity: "",
            categoryId: "",
            brandId: "",
            imageUrls: "",
        });
        setProductSpecs([]);
        setEditingProductId(null);
    };

    const submitBrand = async () => {
        if (!brandForm.name?.trim()) return;

        try {
            if (editingBrandId) {
                const payload: UpdateBrandRequest = { name: brandForm.name, logoUrl: brandForm.logoUrl };
                await BrandsService.putApiV1Brands(editingBrandId, payload);
                showSuccess("Cập nhật brand thành công");
            } else {
                await BrandsService.postApiV1Brands(brandForm);
                showSuccess("Tạo brand thành công");
            }
            resetBrandForm();
            await Promise.all([loadBrands(brandPage), loadDashboard()]);
        } catch (error) {
            showError(error);
        }
    };

    const submitCategory = async () => {
        if (!categoryForm.name?.trim()) return;

        try {
            if (editingCategoryId) {
                await dispatch(updateCategoryThunk({
                    id: editingCategoryId,
                    payload: { name: categoryForm.name, description: categoryForm.description },
                })).unwrap();
                showSuccess("Cập nhật category thành công");
            } else {
                await dispatch(createCategoryThunk(categoryForm)).unwrap();
                showSuccess("Tạo category thành công");
            }
            resetCategoryForm();
            await loadDashboard();
        } catch (error) {
            showError(error);
        }
    };

    const submitSpecKey = async () => {
        if (!specKeyForm.name?.trim()) return;

        try {
            if (editingSpecKeyId) {
                const payload: UpdateSpecKeyRequest = { name: specKeyForm.name, unit: specKeyForm.unit };
                await SpecificationKeysService.putApiV1SpecificationKeys(editingSpecKeyId, payload);
                showSuccess("Cập nhật spec key thành công");
            } else {
                await SpecificationKeysService.postApiV1SpecificationKeys(specKeyForm);
                showSuccess("Tạo spec key thành công");
            }
            resetSpecKeyForm();
            await Promise.all([loadSpecKeys(), loadDashboard()]);
        } catch (error) {
            showError(error);
        }
    };

    const submitProduct = async () => {
        if (!productForm.name.trim() || !productForm.categoryId || !productForm.brandId) return;

        try {
            if (editingProductId) {
                const payload: UpdateProductRequest = {
                    name: productForm.name,
                    description: productForm.description,
                    price: Number(productForm.price || 0),
                    stockQuantity: Number(productForm.stockQuantity || 0),
                    categoryId: Number(productForm.categoryId),
                    brandId: Number(productForm.brandId),
                };
                await ProductsService.putApiV1Products(editingProductId, payload);
                showSuccess("Cập nhật product thành công");
            } else {
                const imagePayload = parseLinesToUrls(productForm.imageUrls).map((url, index) => ({
                    imageUrl: url,
                    isPrimary: index === 0,
                }));

                const specificationPayload: ProductSpecificationRequest[] = productSpecs
                    .filter((item) => item.specificationKeyId > 0 && item.value.trim())
                    .map((item) => ({
                        specificationKeyId: item.specificationKeyId,
                        value: item.value,
                    }));

                const payload: CreateProductRequest = {
                    name: productForm.name,
                    description: productForm.description,
                    price: Number(productForm.price || 0),
                    stockQuantity: Number(productForm.stockQuantity || 0),
                    categoryId: Number(productForm.categoryId),
                    brandId: Number(productForm.brandId),
                    images: imagePayload,
                    specifications: specificationPayload,
                };
                await ProductsService.postApiV1Products(payload);
                showSuccess("Tạo product thành công");
            }

            resetProductForm();
            await Promise.all([loadProducts(productPage), loadDashboard()]);
        } catch (error) {
            showError(error);
        }
    };

    const deleteBrand = async (id?: number) => {
        if (!id) return;
        try {
            await BrandsService.deleteApiV1Brands(id);
            showSuccess("Xóa brand thành công");
            await Promise.all([loadBrands(brandPage), loadDashboard()]);
        } catch (error) {
            showError(error);
        }
    };

    const deleteCategory = async (id?: number) => {
        if (!id) return;
        try {
            await dispatch(deleteCategoryThunk(id)).unwrap();
            showSuccess("Xóa category thành công");
            await loadDashboard();
        } catch (error) {
            showError(error);
        }
    };

    const deleteSpecKey = async (id?: number) => {
        if (!id) return;
        try {
            await SpecificationKeysService.deleteApiV1SpecificationKeys(id);
            showSuccess("Xóa spec key thành công");
            await Promise.all([loadSpecKeys(), loadDashboard()]);
        } catch (error) {
            showError(error);
        }
    };

    const deleteProduct = async (id?: number) => {
        if (!id) return;
        try {
            await ProductsService.deleteApiV1Products(id);
            showSuccess("Xóa product thành công");
            await Promise.all([loadProducts(productPage), loadDashboard()]);
        } catch (error) {
            showError(error);
        }
    };

    const submitCategorySpecSchema = async () => {
        if (!selectedCategoryIdForSchema) return;
        try {
            const payload: UpdateCategorySpecSchemaRequest = {
                items: schemaItems
                    .filter((item) => item.specificationKeyId > 0)
                    .map((item) => ({
                        specificationKeyId: item.specificationKeyId,
                        displayOrder: item.displayOrder,
                    })),
            };

            await CategoriesService.putApiV1CategoriesSpecificationSchema(selectedCategoryIdForSchema, payload);
            showSuccess("Cập nhật spec schema thành công");
            await loadCategorySpecSchema(selectedCategoryIdForSchema);
        } catch (error) {
            showError(error);
        }
    };

    return (
        <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-brand-brown to-brand-brown/90 p-5 text-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-brand-orange/90">E-Shop Admin</p>
                        <h1 className="mt-1 text-2xl font-bold">Catalog Control Center</h1>
                        <p className="mt-1 text-sm text-slate-200">
                            Quản lý danh mục sản phẩm, schema thông số và thống kê tổng quan.
                        </p>
                    </div>
                    <button
                        onClick={reloadAll}
                        disabled={globalLoading}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-brown transition hover:bg-brand-orange/90 disabled:opacity-70"
                    >
                        <RefreshCcw className={`h-4 w-4 ${globalLoading ? "animate-spin" : ""}`} />
                        Đồng bộ dữ liệu
                    </button>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? "bg-brand-orange/20 text-brand-brown"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>

            {feedback && (
                <div
                    className={`rounded-xl border px-4 py-2.5 text-sm ${
                        feedback.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                    {feedback.message}
                </div>
            )}

            {activeTab === "dashboard" && <AdminDashboardTab stats={dashboardStats} />}

            {activeTab === "brands" && (
                <BrandManagementTab
                    brands={brands}
                    brandForm={brandForm}
                    editingBrandId={editingBrandId}
                    brandPage={brandPage}
                    brandTotalPages={brandTotalPages}
                    onChangeForm={setBrandForm}
                    onSubmit={() => void submitBrand()}
                    onReset={resetBrandForm}
                    onEdit={(brand) => {
                        setEditingBrandId(brand.id ?? null);
                        setBrandForm({ name: brand.name ?? "", logoUrl: brand.logoUrl ?? "" });
                    }}
                    onDelete={(id) => void deleteBrand(id)}
                    onPrevPage={() => void loadBrands(brandPage - 1)}
                    onNextPage={() => void loadBrands(brandPage + 1)}
                />
            )}

            {activeTab === "categories" && (
                <CategoryManagementTab
                    categories={categories}
                    categoryForm={categoryForm}
                    editingCategoryId={editingCategoryId}
                    isLoading={isCategoryLoading}
                    isMutating={isCategoryMutating}
                    pageIndex={categoryPageIndex}
                    pageSize={categoryPageSize}
                    totalPages={categoryTotalPages}
                    totalItems={categoryTotalItems}
                    onChangeForm={setCategoryForm}
                    onSubmit={() => void submitCategory()}
                    onReset={resetCategoryForm}
                    onEdit={(category) => {
                        setEditingCategoryId(category.id ?? null);
                        setCategoryForm({ name: category.name ?? "", description: category.description ?? "" });
                    }}
                    onDelete={(id) => void deleteCategory(id)}
                    onChangePage={(nextPageIndex) => void loadCategories(nextPageIndex, categoryPageSize)}
                    onChangePageSize={(nextPageSize) => void loadCategories(1, nextPageSize)}
                />
            )}

            {activeTab === "spec-keys" && (
                <SpecKeyManagementTab
                    specKeys={specKeys}
                    specKeyForm={specKeyForm}
                    editingSpecKeyId={editingSpecKeyId}
                    onChangeForm={setSpecKeyForm}
                    onSubmit={() => void submitSpecKey()}
                    onReset={resetSpecKeyForm}
                    onEdit={(specKey) => {
                        setEditingSpecKeyId(specKey.id ?? null);
                        setSpecKeyForm({ name: specKey.name ?? "", unit: specKey.unit ?? "" });
                    }}
                    onDelete={(id) => void deleteSpecKey(id)}
                />
            )}

            {activeTab === "spec-schema" && (
                <CategorySpecSchemaTab
                    categoryOptions={categoryOptions}
                    specKeys={specKeys}
                    selectedCategoryIdForSchema={selectedCategoryIdForSchema}
                    schemaItems={schemaItems}
                    onSelectCategory={(categoryId) => {
                        if (!categoryId) {
                            setSelectedCategoryIdForSchema(null);
                            setSchemaItems([]);
                            return;
                        }
                        setSelectedCategoryIdForSchema(categoryId);
                        void loadCategorySpecSchema(categoryId);
                    }}
                    onAddSchemaItem={() => setSchemaItems((prev) => [...prev, { specificationKeyId: 0, displayOrder: prev.length + 1 }])}
                    onSaveSchema={() => void submitCategorySpecSchema()}
                    onUpdateSchemaItem={(index, payload) => {
                        setSchemaItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? payload : item)));
                    }}
                    onRemoveSchemaItem={(index) => {
                        setSchemaItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
                    }}
                />
            )}

            {activeTab === "products" && (
                <ProductManagementTab
                    products={products}
                    productForm={productForm}
                    productSpecs={productSpecs}
                    editingProductId={editingProductId}
                    productPage={productPage}
                    productTotalPages={productTotalPages}
                    categoryOptions={categoryOptions}
                    brandOptions={brandOptions}
                    specKeys={specKeys}
                    onChangeForm={setProductForm}
                    onChangeSpec={(index, payload) => {
                        setProductSpecs((prev) => prev.map((item, itemIndex) => (itemIndex === index ? payload : item)));
                    }}
                    onAddSpec={() => setProductSpecs((prev) => [...prev, { specificationKeyId: 0, value: "" }])}
                    onRemoveSpec={(index) => setProductSpecs((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                    onSubmit={() => void submitProduct()}
                    onReset={resetProductForm}
                    onEdit={(product) => {
                        setEditingProductId(product.id ?? null);
                        setProductForm({
                            name: product.name ?? "",
                            description: product.description ?? "",
                            price: String(product.price ?? ""),
                            stockQuantity: String(product.stockQuantity ?? ""),
                            categoryId: String(product.categoryId ?? ""),
                            brandId: String(product.brandId ?? ""),
                            imageUrls: "",
                        });
                        setProductSpecs([]);
                    }}
                    onDelete={(id) => void deleteProduct(id)}
                    onPrevPage={() => void loadProducts(productPage - 1)}
                    onNextPage={() => void loadProducts(productPage + 1)}
                />
            )}
        </div>
    );
}
