/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListRequest = {
    id?: number;
    name?: string;
    /**
     * 书签类型
     */
    type?: ListRequest.type;
    url?: string;
};
// @ts-ignore
export namespace ListRequest {
    /**
     * 书签类型
     */
        // @ts-ignore
    export enum type {
        FOLDER = 'FOLDER',
        ITEM = 'ITEM',
    }
}

