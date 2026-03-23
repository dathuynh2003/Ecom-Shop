/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProductRequest } from '../models/CreateProductRequest';
import type { ProductResponseApiResponse } from '../models/ProductResponseApiResponse';
import type { ProductResponsePagingResultApiResponse } from '../models/ProductResponsePagingResultApiResponse';
import type { StringApiResponse } from '../models/StringApiResponse';
import type { UpdateProductRequest } from '../models/UpdateProductRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
    /**
     * @param requestBody
     * @returns ProductResponseApiResponse OK
     * @throws ApiError
     */
    public static postApiV1Products(
        requestBody?: CreateProductRequest,
    ): CancelablePromise<ProductResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/Products',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param pageIndex
     * @param pageSize
     * @returns ProductResponsePagingResultApiResponse OK
     * @throws ApiError
     */
    public static getApiV1Products(
        pageIndex?: number,
        pageSize?: number,
    ): CancelablePromise<ProductResponsePagingResultApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Products',
            query: {
                'PageIndex': pageIndex,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param productSlug
     * @returns ProductResponseApiResponse OK
     * @throws ApiError
     */
    public static getApiV1ProductsDetail(
        productSlug: string,
    ): CancelablePromise<ProductResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Products/detail/{productSlug}',
            path: {
                'productSlug': productSlug,
            },
        });
    }
    /**
     * @param brandSlug
     * @param pageIndex
     * @param pageSize
     * @returns ProductResponsePagingResultApiResponse OK
     * @throws ApiError
     */
    public static getApiV1ProductsByBrand(
        brandSlug: string,
        pageIndex?: number,
        pageSize?: number,
    ): CancelablePromise<ProductResponsePagingResultApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Products/by-brand/{brandSlug}',
            path: {
                'brandSlug': brandSlug,
            },
            query: {
                'PageIndex': pageIndex,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param categorySlug
     * @param pageIndex
     * @param pageSize
     * @returns ProductResponsePagingResultApiResponse OK
     * @throws ApiError
     */
    public static getApiV1ProductsByCategory(
        categorySlug: string,
        pageIndex?: number,
        pageSize?: number,
    ): CancelablePromise<ProductResponsePagingResultApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Products/by-category/{categorySlug}',
            path: {
                'categorySlug': categorySlug,
            },
            query: {
                'PageIndex': pageIndex,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param categorySlug
     * @param brandSlug
     * @param pageIndex
     * @param pageSize
     * @returns ProductResponsePagingResultApiResponse OK
     * @throws ApiError
     */
    public static getApiV1ProductsByCategoryBrand(
        categorySlug: string,
        brandSlug: string,
        pageIndex?: number,
        pageSize?: number,
    ): CancelablePromise<ProductResponsePagingResultApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/Products/by-category-brand/{categorySlug}/{brandSlug}',
            path: {
                'categorySlug': categorySlug,
                'brandSlug': brandSlug,
            },
            query: {
                'PageIndex': pageIndex,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ProductResponseApiResponse OK
     * @throws ApiError
     */
    public static putApiV1Products(
        id: number,
        requestBody?: UpdateProductRequest,
    ): CancelablePromise<ProductResponseApiResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/Products/{id}',
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
    public static deleteApiV1Products(
        id: number,
    ): CancelablePromise<StringApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/Products/{id}',
            path: {
                'id': id,
            },
        });
    }
}
