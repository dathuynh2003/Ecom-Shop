/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cart } from './Cart';
import type { Product } from './Product';
export type CartItem = {
    isDeleted?: boolean;
    readonly id?: number;
    readonly cartId?: string;
    cart?: Cart;
    readonly productId?: number;
    product?: Product;
    readonly quantity?: number;
};

