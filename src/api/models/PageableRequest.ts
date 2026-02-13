/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MemoPageRequest } from './MemoPageRequest';
/**
 * 分页请求对象
 */
export type PageableRequest = {
    /**
     * 分页页码
     */
    pageNo?: number;
    /**
     * 分页大小
     */
    pageSize?: number;
    /**
     * 查询条件
     */
    query?: MemoPageRequest;
};

