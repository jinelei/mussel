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
export namespace ListRequest {
    /**
     * 书签类型
     */
    export enum type {
        FOLDER = 'FOLDER',
        ITEM = 'ITEM',
    }
}

