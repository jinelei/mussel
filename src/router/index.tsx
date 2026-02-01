import {createBrowserRouter} from 'react-router-dom';
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

type Resolver<T> = () => Promise<T>;

interface RouteProperty {
    index?: boolean
    path?: string;
    component?: ReactNode;
    element?: ReactNode;
    icon?: ReactNode;
    permissions?: boolean | Resolver<boolean>;
    children?: RouteProperty[];
}


const routes: RouteProperty[] = [
    {
        path: '/',
        element: <EmptyLayout/>,
        icon: <FaHome/>,
        permissions: async () => store.getState()?.auth?.userInfo?.permissions?.includes("PAGE_/"),
        children: [
            {index: true, element: <PrivateRoute><Navigation/></PrivateRoute>, icon: <FaHome/>},
        ],
    },
    {
        path: '/memo',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        children: [
            {index: true, element: <PrivateRoute><Memo/></PrivateRoute>, icon: <FaBook/>},
        ],
    },
    {
        path: '/bookmark',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        children: [
            {index: true, element: <PrivateRoute><Bookmark/></PrivateRoute>, icon: <FaBook/>},
        ],
    },
    {
        path: '/about',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        children: [
            {index: true, element: <PrivateRoute><About/></PrivateRoute>, icon: <FaBook/>},
        ],
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {path: '*', element: <NotFound/>}, // 404 路由
];

export {routes};

const router = createBrowserRouter(routes);

export default router;
