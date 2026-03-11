/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type Address = {
    isDeleted?: boolean;
    readonly id?: string;
    readonly userId?: string;
    readonly addressText?: string | null;
    readonly isDefault?: boolean;
    user?: User;
};

