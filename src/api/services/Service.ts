/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkCreateRequest } from '../models/BookmarkCreateRequest';
import type { BookmarkDeleteRequest } from '../models/BookmarkDeleteRequest';
import type { BookmarkGetRequest } from '../models/BookmarkGetRequest';
import type { BookmarkListRequest } from '../models/BookmarkListRequest';
import type { BookmarkListResult } from '../models/BookmarkListResult';
import type { BookmarkSingleResult } from '../models/BookmarkSingleResult';
import type { BookmarkUpdateRequest } from '../models/BookmarkUpdateRequest';
import type { MemoCreateRequest } from '../models/MemoCreateRequest';
import type { MemoDeleteRequest } from '../models/MemoDeleteRequest';
import type { MemoGetRequest } from '../models/MemoGetRequest';
import type { MemoPageResult } from '../models/MemoPageResult';
import type { MemoSingleResult } from '../models/MemoSingleResult';
import type { MemoTagListResult } from '../models/MemoTagListResult';
import type { MemoUpdateRequest } from '../models/MemoUpdateRequest';
import type { PageableRequest } from '../models/PageableRequest';
import type { StringResult } from '../models/StringResult';
import type { UserInfoSingleResult } from '../models/UserInfoSingleResult';
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
     * @returns UserInfoSingleResult OK
     * @throws ApiError
     */
    public static getUserInfo(): CancelablePromise<UserInfoSingleResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/info',
        });
    }
    /**
     * 更新备忘
     * 根据id更新备忘
     * @param requestBody
     * @returns StringResult OK
     * @throws ApiError
     */
    public static memoUpdate(
        requestBody: MemoUpdateRequest,
    ): CancelablePromise<StringResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询备忘标签
     * 查询备忘标签
     * @returns MemoTagListResult OK
     * @throws ApiError
     */
    public static memoTags(): CancelablePromise<MemoTagListResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/tags',
        });
    }
    /**
     * 查询备忘分页
     * 查询备忘分页
     * @param requestBody
     * @returns MemoPageResult OK
     * @throws ApiError
     */
    public static memoPage(
        requestBody: PageableRequest,
    ): CancelablePromise<MemoPageResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/page',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询备忘详情
     * 查询备忘详情
     * @param requestBody
     * @returns MemoSingleResult OK
     * @throws ApiError
     */
    public static memoGet(
        requestBody: MemoGetRequest,
    ): CancelablePromise<MemoSingleResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/get',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 删除备忘
     * 根据id删除备忘
     * @param requestBody
     * @returns StringResult OK
     * @throws ApiError
     */
    public static memoDelete(
        requestBody: MemoDeleteRequest,
    ): CancelablePromise<StringResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 新增备忘
     * 新增备忘
     * @param requestBody
     * @returns StringResult OK
     * @throws ApiError
     */
    public static memoCreate(
        requestBody: MemoCreateRequest,
    ): CancelablePromise<StringResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 更新书签
     * 根据id更新书签
     * @param requestBody
     * @returns StringResult OK
     * @throws ApiError
     */
    public static bookmarkUpdate(
        requestBody: BookmarkUpdateRequest,
    ): CancelablePromise<StringResult> {
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
     * @returns BookmarkListResult OK
     * @throws ApiError
     */
    public static bookmarkTree(): CancelablePromise<BookmarkListResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/tree',
        });
    }
    /**
     * 书签排序
     * 书签排序
     * @param requestBody
     * @returns StringResult OK
     * @throws ApiError
     */
    public static bookmarkSort(
        requestBody: Array<number>,
    ): CancelablePromise<StringResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/sort',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询书签列表
     * 查询书签列表
     * @param requestBody
     * @returns BookmarkListResult OK
     * @throws ApiError
     */
    public static bookmarkList(
        requestBody: BookmarkListRequest,
    ): CancelablePromise<BookmarkListResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询书签列表
     * 查询书签列表
     * @param requestBody
     * @returns BookmarkSingleResult OK
     * @throws ApiError
     */
    public static bookmarkGet(
        requestBody: BookmarkGetRequest,
    ): CancelablePromise<BookmarkSingleResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/get',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 删除书签
     * 根据id删除书签
     * @param requestBody
     * @returns StringResult OK
     * @throws ApiError
     */
    public static bookmarkDelete(
        requestBody: BookmarkDeleteRequest,
    ): CancelablePromise<StringResult> {
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
     * @returns StringResult OK
     * @throws ApiError
     */
    public static bookmarkCreate(
        requestBody: BookmarkCreateRequest,
    ): CancelablePromise<StringResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookmark/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
