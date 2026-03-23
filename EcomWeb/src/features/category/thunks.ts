import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    CategoriesService,
    type CategoryResponse,
    type CreateCategoryRequest,
    type UpdateCategoryRequest,
} from "../../api/client";
import type { RootState } from "../../app/store";

export interface FetchAllCategoriesArgs {
    force?: boolean;
}

export interface FetchAllCategoriesResult {
    items: CategoryResponse[];
    totalItems: number;
    fromCache: boolean;
}

export const fetchAllCategoriesThunk = createAsyncThunk<
    FetchAllCategoriesResult,
    FetchAllCategoriesArgs | undefined,
    { state: RootState }
>(
    "category/fetchAll",
    async (args, { getState, rejectWithValue }) => {
        const state = getState().category;
        const force = !!args?.force;

        if (state.hasLoadedAll && !force) {
            return {
                items: state.orderedIds
                    .map((id) => state.itemsById[id])
                    .filter((item): item is CategoryResponse => !!item),
                totalItems: state.totalItems,
                fromCache: true,
            };
        }

        try {
            const response = await CategoriesService.getApiV1CategoriesAll();
            const items = response.data ?? [];
            return {
                items,
                totalItems: items.length,
                fromCache: false,
            };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createCategoryThunk = createAsyncThunk<CategoryResponse, CreateCategoryRequest>(
    "category/create",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await CategoriesService.postApiV1Categories(payload);
            if (!response.data) {
                return rejectWithValue(response.message ?? "Tạo category thất bại");
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateCategoryThunk = createAsyncThunk<
    CategoryResponse,
    { id: number; payload: UpdateCategoryRequest }
>("category/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        const response = await CategoriesService.putApiV1Categories(id, payload);
        if (!response.data) {
            return rejectWithValue(response.message ?? "Cập nhật category thất bại");
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteCategoryThunk = createAsyncThunk<number, number>(
    "category/delete",
    async (id, { rejectWithValue }) => {
        try {
            await CategoriesService.deleteApiV1Categories(id);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
