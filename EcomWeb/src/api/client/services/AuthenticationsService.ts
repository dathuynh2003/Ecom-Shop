/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegisterResponseApiResponse } from '../models/RegisterResponseApiResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { TokenRequest } from '../models/TokenRequest';
import type { TokenResponseApiResponse } from '../models/TokenResponseApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationsService {
    /**
     * @param requestBody
     * @returns TokenResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsLogin(
        requestBody?: LoginRequest,
    ): CancelablePromise<TokenResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns TokenResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsRefreshToken(
        requestBody?: TokenRequest,
    ): CancelablePromise<TokenResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/refresh-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/logout',
        });
    }
    /**
     * @param requestBody
     * @returns RegisterResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsRegister(
        requestBody?: RegisterRequest,
    ): CancelablePromise<RegisterResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param token
     * @returns StringApiResponse OK
     * @throws ApiError
     */
    public static getApiV1AuthenticationsVerifyEmail(
        token?: string,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Authentications/verify-email',
            query: {
                'token': token,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param email
     * @returns StringApiResponse OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsResendVerificationEmail(
        email?: string,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/resend-verification-email',
            query: {
                'email': email,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param email
     * @returns StringApiResponse OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsRequestPasswordReset(
        email?: string,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/request-password-reset',
            query: {
                'email': email,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns StringApiResponse OK
     * @throws ApiError
     */
    public static postApiV1AuthenticationsResetPassword(
        requestBody?: ResetPasswordRequest,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Authentications/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
