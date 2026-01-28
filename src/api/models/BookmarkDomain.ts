/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 书签领域对象
 */
export type BookmarkDomain = {
    /**
     * 主键ID
     */
    id?: number;
    /**
     * 父级ID
     */
    parentId?: number;
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
     * 书签名称
     */
    name?: string;
    /**
     * 书签类型
     */
    type?: BookmarkDomain.type;
    /**
     * 书签地址
     */
    url?: string;
    /**
     * 书签图标
     */
    icon?: string;
    /**
     * 书签颜色
     */
    color?: string;
    children?: Array<BookmarkDomain>;
};
export namespace BookmarkDomain {
    /**
     * 书签类型
     */
    export enum type {
        FOLDER = 'FOLDER',
        ITEM = 'ITEM',
    }
}

