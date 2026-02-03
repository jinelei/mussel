import {createBrowserRouter, redirect, type RouteObject} from 'react-router-dom';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Navigation from "../pages/Navigation";
import BaseLayout from "../layouts/BaseLayout";
import Login from "../pages/Login";
import Memo from "../pages/Memo.tsx";
import EmptyLayout from "../layouts/EmptyLayout.tsx";
import {FaBook, FaHome} from "react-icons/fa";
import Bookmark from "../pages/Bookmark.tsx";
import PrivateRoute from "../components/PrivateRoute.tsx";
import type {ReactNode} from "react";
import {store} from "../store";
import Forbidden from "../pages/Forbidden.tsx";

type Resolver<T> = () => Promise<T>;

type RouteProperty = RouteObject & {
    icon?: ReactNode;
    permissions?: boolean | Resolver<boolean>;
    children?: RouteProperty[];
}

const isStrictStringArray = (value: unknown): value is string[] => {
    // 第一层校验：排除 null/undefined，且必须是数组类型
    if (value === null || value === undefined || !Array.isArray(value)) {
        return false;
    }

    // 第二层校验：数组中每一个元素都必须是字符串类型（排除数字、对象、布尔值等）
    // every() 会遍历所有元素，全部满足才返回true
    return value.every((item) => {
        // 严格判断类型：typeof item === 'string'
        // 排除类似 new String('xxx') 这种字符串对象（可选，根据你的需求）
        return typeof item === 'string' && item !== ''; // 如需允许空字符串，去掉 && item !== ''
    });
};

const hasIntersection = (arr1: string[] | string | undefined, arr2: string[] | string | undefined): boolean => {
    if (typeof arr1 === 'string') {
        arr1 = JSON.parse(arr1) || [];
    }
    if (typeof arr2 === 'string') {
        arr2 = [arr2];
    }
    if (!isStrictStringArray(arr1) || !isStrictStringArray(arr2)) {
        console.error('入参必须是纯字符串数组', arr1, arr2)
        throw new Error('入参必须是纯字符串数组');
    }

    // 优化：遍历较短的数组，减少循环次数
    const [shortArr, longArr] = arr1.length <= arr2.length ? [arr1, arr2] : [arr2, arr1];

    // some() 找到第一个匹配项就会终止遍历，性能最优
    return shortArr.some(item => longArr.includes(item));
};

const authorizeLoader = (checkLogin: boolean | undefined, hasAnyRoles: string[] | undefined, hasAnyPermissions: string[] | undefined) => {
    return () => {
        if (typeof checkLogin === 'boolean') {
            if (checkLogin) {
                if (!store.getState()?.auth?.token) {
                    console.log('用户未登录', hasAnyPermissions);
                    return redirect('/login');
                }
            } else {
                if (store.getState()?.auth?.token) {
                    console.log('用户已登录', hasAnyPermissions);
                    return redirect('/');
                }
            }
        }
        if (isStrictStringArray(hasAnyRoles)) {
            console.log('hasAnyRoles', hasAnyRoles);
            if (!hasIntersection(store.getState()?.auth?.userInfo?.roles, hasAnyRoles)) {
                console.log('暂无访问角色', hasAnyPermissions);
                return redirect('/403');
            }
        }
        if (isStrictStringArray(hasAnyPermissions)) {
            console.log('hasAnyPermissions', hasAnyPermissions);
            if (!hasIntersection(store.getState()?.auth?.userInfo?.permissions, hasAnyPermissions)) {
                console.log('暂无访问权限', hasAnyPermissions);
                return redirect('/403');
            }
        }
    };
};

const originRoutes: RouteProperty[] = [
    {
        path: '/',
        element: <EmptyLayout/>,
        icon: <FaHome/>,
        loader: authorizeLoader(true, undefined, ['PAGE_/']),
        children: [
            {index: true, element: <PrivateRoute><Navigation/></PrivateRoute>, icon: <FaHome/>},
        ],
    },
    {
        path: '/memo',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        loader: authorizeLoader(true, undefined, ['PAGE_/memo']),
        children: [
            {index: true, element: <PrivateRoute><Memo/></PrivateRoute>, icon: <FaBook/>},
        ],
    },
    {
        path: '/bookmark',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        loader: authorizeLoader(true, undefined, ['PAGE_/bookmark']),
        children: [
            {index: true, element: <PrivateRoute><Bookmark/></PrivateRoute>, icon: <FaBook/>},
        ],
    },
    {
        path: '/about',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        loader: authorizeLoader(true, ['PAGE_/bookmark'], undefined),
        children: [
            {index: true, element: <PrivateRoute><About/></PrivateRoute>, icon: <FaBook/>},
        ],
    },
    {
        path: '/login',
        element: <Login/>,
        loader: authorizeLoader(false, undefined, undefined),
    },
    {
        path: '/403',
        loader: authorizeLoader(true, undefined, undefined),
        element: <Forbidden/>,
    },
    {
        path: '*',
        loader: authorizeLoader(true, undefined, undefined),
        element: <NotFound/>
    },
];

export {originRoutes};

const router = createBrowserRouter(originRoutes);

export default router;
