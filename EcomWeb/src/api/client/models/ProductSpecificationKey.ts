/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from './Product';
import type { SpecificationKey } from './SpecificationKey';
export type ProductSpecificationKey = {
    isDeleted?: boolean;
    readonly productId?: number;
    readonly specificationKeyId?: number;
    readonly value?: string | null;
    product?: Product;
    specificationKey?: SpecificationKey;
};

