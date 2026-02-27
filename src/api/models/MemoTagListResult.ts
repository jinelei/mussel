/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MemoTagResponse } from './MemoTagResponse';
/**
 * 备忘列表返回结果
 */
export type MemoTagListResult = {
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
    data?: Array<MemoTagResponse>;
};

