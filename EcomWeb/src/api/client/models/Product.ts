/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Brand } from './Brand';
import type { Category } from './Category';
import type { ProductImage } from './ProductImage';
import type { ProductSpecificationKey } from './ProductSpecificationKey';
export type Product = {
    isDeleted?: boolean;
    readonly id?: number;
    readonly name?: string | null;
    readonly description?: string | null;
    readonly price?: number;
    readonly stockQuantity?: number;
    readonly slug?: string | null;
    readonly categoryId?: number;
    readonly brandId?: number;
    category?: Category;
    brand?: Brand;
    readonly images?: Array<ProductImage> | null;
    readonly productSpecificationKeys?: Array<ProductSpecificationKey> | null;
};

