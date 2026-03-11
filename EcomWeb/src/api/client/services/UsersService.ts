/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserInfoResponseApiResponse } from '../models/GetUserInfoResponseApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @returns GetUserInfoResponseApiResponse OK
     * @throws ApiError
     */
    public static getApiV1UsersMe(): CancelablePromise<GetUserInfoResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Users/me',
            errors: {
                404: `Not Found`,
            },
        });
    }
}
