/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategorySpecificationKey } from './CategorySpecificationKey';
import type { ProductSpecificationKey } from './ProductSpecificationKey';
export type SpecificationKey = {
    isDeleted?: boolean;
    readonly id?: number;
    readonly name?: string | null;
    readonly unit?: string | null;
    readonly categorySpecificationKeys?: Array<CategorySpecificationKey> | null;
    readonly productSpecificationKeys?: Array<ProductSpecificationKey> | null;
};

