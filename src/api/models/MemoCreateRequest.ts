/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 备忘创建请求
 */
export type MemoCreateRequest = {
    /**
     * 备忘标题
     */
    title: string;
    /**
     * 副备忘标题
     */
    subTitle: string;
    /**
     * 备忘内容
     */
    content: string;
    /**
     * 书签排序
     */
    orderNumber?: number;
    /**
     * 备忘关联标签列表
     */
    tagIds?: Array<number>;
};

