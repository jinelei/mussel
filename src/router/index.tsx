import {
    createBrowserRouter,
    type RouteObject
} from 'react-router-dom';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Index from "../pages/Index.tsx";
import BaseLayout from "../layouts/BaseLayout";
import Login from "../pages/Login";
import Memo from "../pages/Memo.tsx";
import EmptyLayout from "../layouts/EmptyLayout.tsx";
import {FaBook, FaHome} from "react-icons/fa";
import Bookmark from "../pages/Bookmark.tsx";
import AuthorizedGuard from "../components/AuthorizedGuard.tsx";
import Forbidden from "../pages/Forbidden.tsx";
import type {ReactNode} from "react";
import {store} from "../store";

export interface MenuItem {
    path: string;
    title: string;
    icon?: ReactNode;
    children?: MenuItem[];
}

export interface AuthRouteHandle {
    title?: string | undefined;
    icon?: ReactNode | undefined;
    showInMenu?: boolean | undefined;
    requireLogin: boolean | undefined;
    roles?: string[] | undefined;
    permissions?: string[] | undefined;
}

const originRoutes: RouteObject[] = [
    {
        path: '/',
        element: <EmptyLayout/>,
        handle: {
            showInMenu: true,
        },
        children: [
            {
                index: true,
                handle: {
                    title: '首页',
                    icon: <FaHome/>,
                    showInMenu: true,
                    requireLogin: true,
                    roles: [],
                    permissions: ['PAGE_/'],
                },
                element: <AuthorizedGuard><Index/></AuthorizedGuard>,
            },
        ],
    },
    {
        path: '/memo',
        element: <BaseLayout/>,
        handle: {
            showInMenu: true,
        },
        children: [
            {
                index: true,
                handle: {
                    title: '备忘',
                    icon: <FaBook/>,
                    showInMenu: true,
                    requireLogin: true,
                    roles: [],
                    permissions: ['PAGE_/memo'],
                },
                element: <AuthorizedGuard><Memo/></AuthorizedGuard>,
            }
        ]
    },
    {
        path: '/bookmark',
        element: <BaseLayout/>,
        handle: {
            showInMenu: true,
        },
        children: [
            {
                index: true,
                handle: {
                    title: '书签',
                    icon: <FaBook/>,
                    showInMenu: true,
                    requireLogin: true,
                    roles: [],
                    permissions: ['PAGE_/bookmark'],
                },
                element: <AuthorizedGuard><Bookmark/></AuthorizedGuard>,
            },
        ]
    },
    {
        path: '/about',
        element: <BaseLayout/>,
        handle: {
            showInMenu: true,
        },
        children: [
            {
                index: true,
                handle: {
                    title: '关于',
                    icon: <FaBook/>,
                    showInMenu: true,
                    requireLogin: true,
                    roles: [],
                    permissions: ['PAGE_/about'],
                },
                element: <AuthorizedGuard><About/></AuthorizedGuard>,
            }
        ]
    },
    {
        path: '/login',
        handle: {
            showInMenu: false,
            requireLogin: false,
        },
        element: <AuthorizedGuard><Login/></AuthorizedGuard>,
    },
    {
        path: '/403',
        handle: {
            showInMenu: false,
            requireLogin: true,
        },
        element: <AuthorizedGuard><Forbidden/></AuthorizedGuard>,
    },
    {
        path: '*',
        handle: {
            showInMenu: false,
            requireLogin: true,
        },
        element: <AuthorizedGuard><NotFound/></AuthorizedGuard>
    },
];

// 获取当前登录用户下所有有权限的路由集合,并转成菜单的方式返回.
// 判断条件
// 1. 如果有showInMenu才处理,否则不处理
// 2. 如果requireLogin存在,且值为true,则检查store.getState().auth.token是否存在,不存在则不满足,满足则返回,不满足则继续往下判断
// 3. 如果requireLogin存在,且值为false,则检查store.getState().auth.token是否存在,存在则不满足,满足则返回,不满足则继续往下判断
// 4. 如果roles存在,且值不为空字符串数组,则检查store.getState().auth.roles是否包含roles,包含则满足,满足则返回,不满足则继续往下判断
// 5. 如果permissions存在,且值不为空字符串数组,则检查store.getState().auth.permissions是否包含permissions,包含则满足,满足则返回,不满足则继续往下判断
const authorizedRoutes = () => {
    const {
        auth: {
            token = '',
            userInfo: {roles = [], permissions = []} = {}
        } = {}
    } = store.getState();
    const traverseRoutes = (routeList: RouteObject[], parentPath = ''): MenuItem[] => {
        const currentLevelMenu: MenuItem[] = [];
        routeList.forEach(it => {
            let route = it;
            let filter = (route.children || []).filter(it => it.index === true);
            let handle = route.handle as AuthRouteHandle | undefined;
            if (filter.length == 1) {
                handle = filter[0].handle;
            }
            if (handle?.showInMenu !== true) return;
            const fullPath = route.index
                ? parentPath
                : (parentPath + route.path).replace(/\/+/g, '/');
            let hasPermission = false;
            if (handle?.requireLogin !== undefined) {
                if (handle.requireLogin) {
                    if (token) hasPermission = true;
                    else return;
                } else {
                    if (!token) hasPermission = true;
                    else return;
                }
            }
            if (hasPermission && handle?.roles && handle.roles.length > 0) {
                hasPermission = handle.roles.some(role => roles.includes(role));
                if (!hasPermission) return;
            }
            if (hasPermission && handle?.permissions && handle.permissions.length > 0) {
                hasPermission = handle.permissions.some(perm => permissions.includes(perm));
                if (!hasPermission) return;
            }
            if (hasPermission && handle?.title) {
                const menuItem: MenuItem = {
                    path: fullPath,
                    title: handle.title,
                    icon: handle.icon,
                };
                if (route.children && route.children.length > 0) {
                    const childMenu = traverseRoutes(route.children.filter(it => !it.index), fullPath);
                    if (childMenu.length > 0) {
                        menuItem.children = childMenu;
                    }
                }
                currentLevelMenu.push(menuItem);
            }
        });
        return currentLevelMenu;
    };
    return traverseRoutes(originRoutes);
}

const router = createBrowserRouter(originRoutes);

export {router, originRoutes, authorizedRoutes};
