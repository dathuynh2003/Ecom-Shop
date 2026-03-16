/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type EmailVerificationToken = {
    isDeleted?: boolean;
    readonly id?: string;
    readonly userId?: string;
    readonly token?: string | null;
    readonly expiresAt?: string;
    readonly isUsed?: boolean;
    user?: User;
};

