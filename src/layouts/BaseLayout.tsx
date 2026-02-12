import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import {FaSignOutAlt} from 'react-icons/fa';

import {clearToken, type RootState, store} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {Flex, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import {authorizedRoutes, type MenuItem} from "../router";
import {LoadingOutlined, MoonOutlined} from "@ant-design/icons";

import styles from './BaseLayout.module.css';
import Footer from "../pages/Footer.tsx";

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
        <Flex vertical justify='start' align='center' className={styles.container}>
            <Flex justify={'space-between'} align='center' className={styles.titleContainer}>
                <Flex>
                    <Typography.Text className={styles.title}>JINELEI</Typography.Text>
                    <MoonOutlined/>
                </Flex>
                <Flex>
                    {menuList.map((item) => (
                        <Link to={item.path} key={item.path}>
                            <Typography.Text
                                className={location.pathname === item.path ? styles.navActive : styles.nav}>{item.title}</Typography.Text>
                        </Link>
                    ))}
                    <Flex align='center'>
                        <Typography.Text
                            className={styles.username}>{store.getState().auth.userInfo.username}</Typography.Text>
                        <FaSignOutAlt onClick={() => {
                            dispatch(clearToken());
                            navigate("/login", {replace: true});
                        }}/>
                    </Flex>
                </Flex>
            </Flex>

            <main className={styles.context}>
                <Spin spinning={isLoading} fullscreen tip="加载中..."
                      indicator={<LoadingOutlined spin/>}/>
                <Outlet/>
            </main>

            <Footer className={styles.footer}></Footer>
        </Flex>
    );
}

export default BaseLayout;
