import {createBrowserRouter} from 'react-router-dom';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Navigation from "../pages/Navigation";
import BaseLayout from "../layouts/BaseLayout";
import Login from "../pages/Login";

const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout/>,
        children: [
            {index: true, element: <Navigation/>},
            {path: 'about', element: <About/>},
        ],
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {path: '*', element: <NotFound/>}, // 404 路由
]);

export default router;
