/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponseApiResponse } from '../models/CategoryResponseApiResponse';
import type { CategoryResponseListApiResponse } from '../models/CategoryResponseListApiResponse';
import type { CategoryResponsePagingResultApiResponse } from '../models/CategoryResponsePagingResultApiResponse';
import type { CategorySpecSchemaResponseApiResponse } from '../models/CategorySpecSchemaResponseApiResponse';
import type { CreateCategoryRequest } from '../models/CreateCategoryRequest';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { UpdateCategoryRequest } from '../models/UpdateCategoryRequest';
import type { UpdateCategorySpecSchemaRequest } from '../models/UpdateCategorySpecSchemaRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * @param requestBody
     * @returns CategoryResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1Categories(
        requestBody?: CreateCategoryRequest,
    ): CancelablePromise<CategoryResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param pageIndex
     * @param pageSize
     * @returns CategoryResponsePagingResultApiResponse OK
     * @throws ApiError
     */
    public static getApiV1Categories(
        pageIndex?: number,
        pageSize?: number,
    ): CancelablePromise<CategoryResponsePagingResultApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Categories',
            query: {
                'PageIndex': pageIndex,
                'PageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @returns CategoryResponseListApiResponse OK
     * @throws ApiError
     */
    public static getApiV1CategoriesAll(): CancelablePromise<CategoryResponseListApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Categories/all',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param id
     * @returns CategoryResponseApiResponse OK
     * @throws ApiError
     */
    public static getApiV1Categories1(
        id: number,
    ): CancelablePromise<CategoryResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CategoryResponseApiResponse OK
     * @throws ApiError
     */
    public static putApiV1Categories(
        id: number,
        requestBody?: UpdateCategoryRequest,
    ): CancelablePromise<CategoryResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Categories/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param id
     * @returns StringApiResponse OK
     * @throws ApiError
     */
    public static deleteApiV1Categories(
        id: number,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param id
     * @returns CategorySpecSchemaResponseApiResponse OK
     * @throws ApiError
     */
    public static getApiV1CategoriesSpecificationSchema(
        id: number,
    ): CancelablePromise<CategorySpecSchemaResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Categories/{id}/specification-schema',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CategorySpecSchemaResponseApiResponse OK
     * @throws ApiError
     */
    public static putApiV1CategoriesSpecificationSchema(
        id: number,
        requestBody?: UpdateCategorySpecSchemaRequest,
    ): CancelablePromise<CategorySpecSchemaResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Categories/{id}/specification-schema',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
