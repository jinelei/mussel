/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MemoTagDomain } from './MemoTagDomain';
/**
 * 备忘响应对象
 */
export type MemoResponse = {
    /**
     * 主键ID
     */
    id?: number;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
    /**
     * 排序值
     */
    orderNumber?: number;
    /**
     * 备忘标题
     */
    title?: string;
    /**
     * 备忘副标题
     */
    subTitle?: string;
    /**
     * 备忘内容
     */
    content?: string;
    /**
     * 备忘关联标签对象列表
     */
    tags?: Array<MemoTagDomain>;
    /**
     * 备忘关联标签列表
     */
    tagIds?: Array<number>;
};

