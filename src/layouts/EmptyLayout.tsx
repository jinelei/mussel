import {Outlet, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {store} from "../store";

const EmptyLayout = () => {
    const location = useLocation();

    useEffect(() => {
        const isLogin = store.getState().auth.token;
        if (!isLogin && location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }, [location]);

    return (
        <>
            <Outlet/>
        </>
    );
}

export default EmptyLayout;
