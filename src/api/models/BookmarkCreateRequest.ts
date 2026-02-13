/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 书签创建请求
 */
export type BookmarkCreateRequest = {
    /**
     * 书签名称
     */
    name: string;
    /**
     * 书签类型
     */
    type: BookmarkCreateRequest.type;
    /**
     * 书签地址
     */
    url: string;
    /**
     * 书签图标
     */
    icon: string;
    /**
     * 书签颜色
     */
    color: string;
    /**
     * 父级ID
     */
    parentId?: number;
};
export namespace BookmarkCreateRequest {
    /**
     * 书签类型
     */
    export enum type {
        FOLDER = 'FOLDER',
        ITEM = 'ITEM',
    }
}

