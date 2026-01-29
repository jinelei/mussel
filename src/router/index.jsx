import {createBrowserRouter} from 'react-router-dom';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Navigation from "../pages/Navigation";
import BaseLayout from "../layouts/BaseLayout";
import Login from "../pages/Login";
import Memo from "../pages/Memo.tsx";
import EmptyLayout from "../layouts/EmptyLayout.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <EmptyLayout/>,
        children: [
            {index: true, element: <Navigation/>},
            {path: 'about', element: <About/>},
        ],
    },
    {
        path: '/memo',
        element: <BaseLayout/>,
        children: [
            {index: true, element: <Memo/>},
        ],
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {path: '*', element: <NotFound/>}, // 404 路由
]);

export default router;
