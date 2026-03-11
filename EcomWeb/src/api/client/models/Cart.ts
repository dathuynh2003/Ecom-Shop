/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CartItem } from './CartItem';
import type { User } from './User';
export type Cart = {
    isDeleted?: boolean;
    readonly id?: string;
    readonly userId?: string | null;
    user?: User;
    readonly sessionID?: string | null;
    readonly items?: Array<CartItem> | null;
};

