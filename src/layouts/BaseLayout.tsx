import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {FaHome, FaUser, FaCog, FaSignOutAlt} from 'react-icons/fa';

import {routes} from '../router';
import {Typography} from "antd";
import {clearToken, store} from "../store";
import {useDispatch} from "react-redux";

const BaseLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('当前页面路径：', location.pathname);
        const isLogin = store.getState().auth.token;
        if (!isLogin && location.pathname !== '/login') {
            window.location.href = '/login';
        }
        console.log('获取路由', routes);
    });

    const menuList = [
        {path: '/memo', label: '备忘', icon: <FaHome/>},
        {path: '/bookmark', label: '书签', icon: <FaUser/>},
        {path: '/about', label: '关于我', icon: <FaCog/>},
    ];

    return (
        <div style={{display: 'flex', height: '100vh', margin: 0, padding: 0}}>
            <aside
                style={{
                    width: '200px',
                    background: '#2c3e50',
                    color: 'white',
                }}
            >
                <Typography.Text onClick={() => navigate("/")}
                                 style={{
                                     margin: '0.5rem 0',
                                     fontSize: '1.5rem',
                                     fontWeight: 'bold',
                                     background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                                     backgroundClip: 'text',
                                     color: 'transparent',
                                     letterSpacing: '0.5px',
                                     textAlign: 'center',
                                     cursor: 'pointer',
                                     width: '100%',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                 }}
                >自留地</Typography.Text>

                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {menuList.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 2rem',
                                    color: 'white',
                                    textDecoration: 'none',
                                    background: location.pathname === item.path ? '#34495e' : 'transparent',
                                }}
                            >
                                <span style={{marginRight: '10px'}}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={{position: 'absolute', bottom: '20px', width: '200px'}}>
                    <button
                        style={{
                            width: '80%',
                            margin: '0 10%',
                            padding: '8px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            dispatch(clearToken());
                            window.location.href = '/login';
                        }}
                    >
                        <FaSignOutAlt style={{marginRight: '5px'}}/> 退出登录
                    </button>
                </div>
            </aside>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <header
                    style={{
                        height: '60px',
                        background: 'white',
                        borderBottom: '1px solid #eee',
                        padding: '0 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                        当前页面：{menuList.find(item => item.path === location.pathname)?.label || '未知页面'}
                    </div>
                    <Typography.Text>{store.getState().auth.userInfo.username}</Typography.Text>
                </header>

                <main style={{flex: 1, padding: '20px', overflow: 'auto'}}>
                    <Outlet/>
                </main>

                <footer
                    style={{
                        height: '40px',
                        background: '#f5f5f5',
                        textAlign: 'center',
                        lineHeight: '40px',
                        fontSize: '12px',
                        color: '#666',
                    }}
                >
                    <Typography.Text> © 2026 系统管理后台 - 版权所有 </Typography.Text>
                </footer>
            </div>
        </div>
    );
}

export default BaseLayout;
