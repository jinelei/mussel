/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 书签列表请求
 */
export type BookmarkListRequest = {
    /**
     * 书签ID
     */
    id?: number;
    /**
     * 书签名称
     */
    name?: string;
    /**
     * 书签类型
     */
    type?: BookmarkListRequest.type;
    /**
     * 书签地址
     */
    url?: string;
};
export namespace BookmarkListRequest {
    /**
     * 书签类型
     */
    export enum type {
        FOLDER = 'FOLDER',
        ITEM = 'ITEM',
    }
}

