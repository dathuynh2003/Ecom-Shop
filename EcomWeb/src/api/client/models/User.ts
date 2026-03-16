/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { Cart } from './Cart';
import type { UserRole } from './UserRole';
import type { UserToken } from './UserToken';
export type User = {
    isDeleted?: boolean;
    readonly id?: string;
    readonly name?: string | null;
    readonly email?: string | null;
    readonly phoneNumber?: string | null;
    readonly dob?: string;
    readonly password?: string | null;
    readonly createdAt?: string;
    readonly isActive?: boolean;
    readonly avatarUrl?: string | null;
    role?: UserRole;
    readonly addresses?: Array<Address> | null;
    cartId?: string;
    cart?: Cart;
    readonly userTokens?: Array<UserToken> | null;
};

