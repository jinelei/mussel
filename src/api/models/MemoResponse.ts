/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MemoTagDomain } from './MemoTagDomain';
/**
 * 备忘详情响应
 */
export type MemoResponse = {
    title: string;
    /**
     * 副备忘标题
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
    /**
     * 书签排序
     */
    orderNumber?: number;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
};

