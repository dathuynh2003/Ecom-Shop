/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandResponseApiResponse } from '../models/BrandResponseApiResponse';
import type { BrandResponseListApiResponse } from '../models/BrandResponseListApiResponse';
import type { BrandResponsePagingResultApiResponse } from '../models/BrandResponsePagingResultApiResponse';
import type { CreateBrandRequest } from '../models/CreateBrandRequest';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { UpdateBrandRequest } from '../models/UpdateBrandRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BrandsService {
    /**
     * @param requestBody
     * @returns BrandResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1Brands(
        requestBody?: CreateBrandRequest,
    ): CancelablePromise<BrandResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Brands',
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
     * @returns BrandResponsePagingResultApiResponse OK
     * @throws ApiError
     */
    public static getApiV1Brands(
        pageIndex?: number,
        pageSize?: number,
    ): CancelablePromise<BrandResponsePagingResultApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Brands',
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
     * @returns BrandResponseListApiResponse OK
     * @throws ApiError
     */
    public static getApiV1BrandsAll(): CancelablePromise<BrandResponseListApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Brands/all',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * @param id
     * @returns BrandResponseApiResponse OK
     * @throws ApiError
     */
    public static getApiV1Brands1(
        id: number,
    ): CancelablePromise<BrandResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Brands/{id}',
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
     * @returns BrandResponseApiResponse OK
     * @throws ApiError
     */
    public static putApiV1Brands(
        id: number,
        requestBody?: UpdateBrandRequest,
    ): CancelablePromise<BrandResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Brands/{id}',
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
    public static deleteApiV1Brands(
        id: number,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Brands/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
