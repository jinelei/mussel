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
        <div style={{display: 'flex', height: '100vh', margin: 0, padding: 0}}>
            <Outlet/>
        </div>
    );
}

export default EmptyLayout;
