/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductImageRequest } from './ProductImageRequest';
import type { ProductSpecificationRequest } from './ProductSpecificationRequest';
export type CreateProductRequest = {
    name?: string | null;
    description?: string | null;
    price?: number;
    stockQuantity?: number;
    categoryId?: number;
    brandId?: number;
    images?: Array<ProductImageRequest> | null;
    specifications?: Array<ProductSpecificationRequest> | null;
};

