/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductImageItemResponse } from './ProductImageItemResponse';
import type { ProductSpecificationItemResponse } from './ProductSpecificationItemResponse';
export type ProductResponse = {
    id?: number;
    name?: string | null;
    description?: string | null;
    price?: number;
    stockQuantity?: number;
    slug?: string | null;
    categoryId?: number;
    categoryName?: string | null;
    categorySlug?: string | null;
    brandId?: number;
    brandName?: string | null;
    brandSlug?: string | null;
    images?: Array<ProductImageItemResponse> | null;
    specifications?: Array<ProductSpecificationItemResponse> | null;
};

