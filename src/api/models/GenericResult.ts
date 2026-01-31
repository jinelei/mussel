/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserInfoResponse } from './UserInfoResponse';
/**
 * 通用响应对象
 */
export type GenericResult = {
    /**
     * 错误代码
     */
    code?: number;
    /**
     * 错误信息
     */
    message?: string;
    data?: UserInfoResponse;
};

