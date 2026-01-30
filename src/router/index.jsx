import {createBrowserRouter} from 'react-router-dom';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Navigation from "../pages/Navigation";
import BaseLayout from "../layouts/BaseLayout";
import Login from "../pages/Login";
import Memo from "../pages/Memo.tsx";
import EmptyLayout from "../layouts/EmptyLayout.tsx";
import {FaBook, FaHome, FaUser} from "react-icons/fa";

const routes = [
    {
        path: '/',
        element: <EmptyLayout/>,
        icon: <FaHome/>,
        children: [
            {index: true, element: <Navigation/>, icon: <FaHome/>},
            {path: 'about', element: <About/>, icon: <FaUser/>},
        ],
    },
    {
        path: '/memo',
        element: <BaseLayout/>,
        icon: <FaBook/>,
        children: [
            {index: true, element: <Memo/>, icon: <FaBook/>},
        ],
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {path: '*', element: <NotFound/>}, // 404 路由
];

export {routes};

export default createBrowserRouter(routes);
