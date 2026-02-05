import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import {FaSignOutAlt} from 'react-icons/fa';

import {clearToken, type RootState, store} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import {authorizedRoutes, type MenuItem} from "../router";
import {LoadingOutlined} from "@ant-design/icons";

const BaseLayout = () => {
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => (state as RootState)?.global?.loading);

    useEffect(() => {
        let menuItems = authorizedRoutes();
        setMenuList(menuItems);
    }, [location.pathname]);

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
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
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
                        {menuList.find(item => item.path === location.pathname)?.title || '未知页面'}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography.Text>{store.getState().auth.userInfo.username}</Typography.Text>
                        <FaSignOutAlt style={{marginLeft: '5px', color: 'gray'}} onClick={() => {
                            dispatch(clearToken());
                            window.location.href = '/login';
                        }}/>
                    </div>
                </header>

                <main style={{flex: 1, padding: '20px', overflow: 'auto'}}>
                    <Spin spinning={isLoading} fullscreen tip="加载中..."
                          indicator={<LoadingOutlined spin/>}/>
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
