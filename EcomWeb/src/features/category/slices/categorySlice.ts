import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryResponse } from "../../../api/client";
import type { RootState } from "../../../app/store";
import {
    createCategoryThunk,
    deleteCategoryThunk,
    fetchAllCategoriesThunk,
    updateCategoryThunk,
} from "../thunks";

interface CategoryFilters {
    searchTerm: string;
    selectedCategoryId: number | null;
}

interface CategoryState {
    itemsById: Record<number, CategoryResponse>;
    orderedIds: number[];
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasLoadedAll: boolean;
    isLoading: boolean;
    isMutating: boolean;
    error: string | null;
    filters: CategoryFilters;
}

const initialState: CategoryState = {
    itemsById: {},
    orderedIds: [],
    pageIndex: 1,
    pageSize: 5,
    totalPages: 1,
    totalItems: 0,
    hasLoadedAll: false,
    isLoading: false,
    isMutating: false,
    error: null,
    filters: {
        searchTerm: "",
        selectedCategoryId: null,
    },
};

function normalizeCategory(category: CategoryResponse) {
    return {
        ...category,
        name: category.name ?? "",
        slug: category.slug ?? "",
        description: category.description ?? "",
    };
}

function recalculatePagination(state: CategoryState) {
    state.totalItems = state.orderedIds.length;
    state.totalPages = Math.max(1, Math.ceil(state.totalItems / state.pageSize));
    if (state.pageIndex > state.totalPages) {
        state.pageIndex = state.totalPages;
    }
    if (state.pageIndex < 1) {
        state.pageIndex = 1;
    }
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategoryPagination(state, action: PayloadAction<{ pageIndex?: number; pageSize?: number }>) {
            const nextPageSize = action.payload.pageSize ?? state.pageSize;
            state.pageSize = nextPageSize > 0 ? nextPageSize : state.pageSize;
            state.pageIndex = action.payload.pageIndex ?? state.pageIndex;
            recalculatePagination(state);
        },
        setCategoryFilters(state, action: PayloadAction<Partial<CategoryFilters>>) {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },
        resetCategoryFilters(state) {
            state.filters = {
                searchTerm: "",
                selectedCategoryId: null,
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllCategoriesThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAllCategoriesThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            const normalizedItems = action.payload.items.map(normalizeCategory);
            const nextItemsById: Record<number, CategoryResponse> = {};
            const nextOrderedIds: number[] = [];

            normalizedItems.forEach((item) => {
                if (!item.id) return;
                nextItemsById[item.id] = item;
                nextOrderedIds.push(item.id);
            });

            state.itemsById = nextItemsById;
            state.orderedIds = nextOrderedIds;
            state.hasLoadedAll = true;
            recalculatePagination(state);
            state.error = null;
        });
        builder.addCase(fetchAllCategoriesThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = (action.payload as string) ?? "Không tải được danh mục";
        });

        builder.addCase(createCategoryThunk.pending, (state) => {
            state.isMutating = true;
            state.error = null;
        });
        builder.addCase(createCategoryThunk.fulfilled, (state, action) => {
            state.isMutating = false;
            const created = normalizeCategory(action.payload);
            if (created.id) {
                state.itemsById[created.id] = created;
                state.orderedIds = [created.id, ...state.orderedIds.filter((id) => id !== created.id)];
                recalculatePagination(state);
            }
            state.error = null;
        });
        builder.addCase(createCategoryThunk.rejected, (state, action) => {
            state.isMutating = false;
            state.error = (action.payload as string) ?? "Tạo category thất bại";
        });

        builder.addCase(updateCategoryThunk.pending, (state) => {
            state.isMutating = true;
            state.error = null;
        });
        builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
            state.isMutating = false;
            const updated = normalizeCategory(action.payload);
            if (updated.id) {
                state.itemsById[updated.id] = updated;
            }
            state.error = null;
        });
        builder.addCase(updateCategoryThunk.rejected, (state, action) => {
            state.isMutating = false;
            state.error = (action.payload as string) ?? "Cập nhật category thất bại";
        });

        builder.addCase(deleteCategoryThunk.pending, (state) => {
            state.isMutating = true;
            state.error = null;
        });
        builder.addCase(deleteCategoryThunk.fulfilled, (state, action) => {
            state.isMutating = false;
            delete state.itemsById[action.payload];
            state.orderedIds = state.orderedIds.filter((id) => id !== action.payload);
            recalculatePagination(state);

            if (state.filters.selectedCategoryId === action.payload) {
                state.filters.selectedCategoryId = null;
            }
            state.error = null;
        });
        builder.addCase(deleteCategoryThunk.rejected, (state, action) => {
            state.isMutating = false;
            state.error = (action.payload as string) ?? "Xóa category thất bại";
        });
    },
});

export const { setCategoryPagination, setCategoryFilters, resetCategoryFilters } = categorySlice.actions;

export const selectCategoryCurrentPageItems = (state: RootState): CategoryResponse[] => {
    const start = (state.category.pageIndex - 1) * state.category.pageSize;
    const end = start + state.category.pageSize;
    return state.category.orderedIds
        .slice(start, end)
        .map((id) => state.category.itemsById[id])
        .filter((item): item is CategoryResponse => !!item);
};

export const selectAllCachedCategories = (state: RootState): CategoryResponse[] => {
    return state.category.orderedIds
        .map((id) => state.category.itemsById[id])
        .filter((item): item is CategoryResponse => !!item);
};

export default categorySlice.reducer;
