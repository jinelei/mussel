/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkResponse } from './BookmarkResponse';
/**
 * 书签列表返回结果
 */
export type BookmarkListResult = {
    /**
     * 错误代码
     */
    code?: number;
    /**
     * 错误信息
     */
    message?: string;
    /**
     * 总计
     */
    total?: number;
    /**
     * 响应数据
     */
    data?: Array<BookmarkResponse>;
};

