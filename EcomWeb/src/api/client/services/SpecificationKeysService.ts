/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSpecKeyRequest } from '../models/CreateSpecKeyRequest';
import type { SpecKeyResponseApiResponse } from '../models/SpecKeyResponseApiResponse';
import type { SpecKeyResponseIEnumerableApiResponse } from '../models/SpecKeyResponseIEnumerableApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { UpdateSpecKeyRequest } from '../models/UpdateSpecKeyRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SpecificationKeysService {
    /**
     * @param requestBody
     * @returns SpecKeyResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1SpecificationKeys(
        requestBody?: CreateSpecKeyRequest,
    ): CancelablePromise<SpecKeyResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/SpecificationKeys',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns SpecKeyResponseIEnumerableApiResponse OK
     * @throws ApiError
     */
    public static getApiV1SpecificationKeys(): CancelablePromise<SpecKeyResponseIEnumerableApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/SpecificationKeys',
        });
    }
    /**
     * @param id
     * @returns SpecKeyResponseApiResponse OK
     * @throws ApiError
     */
    public static getApiV1SpecificationKeys1(
        id: number,
    ): CancelablePromise<SpecKeyResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/SpecificationKeys/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns SpecKeyResponseApiResponse OK
     * @throws ApiError
     */
    public static putApiV1SpecificationKeys(
        id: number,
        requestBody?: UpdateSpecKeyRequest,
    ): CancelablePromise<SpecKeyResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/SpecificationKeys/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns StringApiResponse OK
     * @throws ApiError
     */
    public static deleteApiV1SpecificationKeys(
        id: number,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/SpecificationKeys/{id}',
            path: {
                'id': id,
            },
        });
    }
}
