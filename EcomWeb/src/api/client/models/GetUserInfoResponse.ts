/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
export type GetUserInfoResponse = {
    id?: string;
    fullName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    dob?: string;
    avatarUrl?: string | null;
    roleName?: string | null;
    addresses?: Array<Address> | null;
    cartID?: string;
};

