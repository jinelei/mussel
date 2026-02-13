/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MemoResponse } from './MemoResponse';
/**
 * 分页响应对象
 */
export type PageableResult = {
    /**
     * 错误代码
     */
    code?: number;
    /**
     * 错误信息
     */
    message?: string;
    /**
     * 分页页码
     */
    pageNo?: number;
    /**
     * 分页大小
     */
    pageSize?: number;
    /**
     * 总计
     */
    total?: number;
    /**
     * 响应数据
     */
    data?: Array<MemoResponse>;
};

