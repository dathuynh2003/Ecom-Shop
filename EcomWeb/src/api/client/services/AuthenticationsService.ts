/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
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
}
