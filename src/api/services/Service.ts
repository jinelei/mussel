/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkDomain } from '../models/BookmarkDomain';
import type { CreateRequest } from '../models/CreateRequest';
import type { GenericResult } from '../models/GenericResult';
import type { UpdateRequest } from '../models/UpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 用户登录
     * Spring Security 默认登录接口
     * @param formData 登录参数
     * @returns any 登录成功，跳转首页
     * @throws ApiError
     */
    public static postLogin(
        formData: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                401: `用户名或密码错误`,
            },
        });
    }
    /**
     * 用户信息
     * 获取当前登录用户相关信息
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static getUserInfo(): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/info',
        });
    }
    /**
     * 更新备忘
     * 根据id更新备忘
     * @param req
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static memoUpdate(
        req: UpdateRequest,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/update',
            query: {
                'req': req,
            },
        });
    }
    /**
     * 删除备忘
     * 根据id删除备忘
     * @param id
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static memoDelete(
        id: number,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/delete/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 新增备忘
     * 新增备忘
     * @param req
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static memoCreate(
        req: CreateRequest,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/create',
            query: {
                'req': req,
            },
        });
    }
    /**
     * 更新书签
     * 根据id更新书签
     * @param requestBody
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static bookmarkUpdate(
        requestBody: BookmarkDomain,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询书签树
     * 查询书签树
     * @param requestBody
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static bookmarkTree(
        requestBody: BookmarkDomain,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/tree',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 我收藏的书签
     * 我收藏的书签
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static myFavoriteBookmarks(): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/myFavoriteBookmarks',
        });
    }
    /**
     * 查询书签列表
     * 查询书签列表
     * @param requestBody
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static bookmarkList(
        requestBody: BookmarkDomain,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 删除书签
     * 根据id删除书签
     * @param requestBody
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static bookmarkDelete(
        requestBody: BookmarkDomain,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 新增书签
     * 新增书签
     * @param requestBody
     * @returns GenericResult OK
     * @throws ApiError
     */
    public static bookmarkCreate(
        requestBody: BookmarkDomain,
    ): CancelablePromise<GenericResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
