import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import {FaSignOutAlt} from 'react-icons/fa';

import {clearToken, type RootState, store} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {Dropdown, Flex, type MenuProps, Space, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import {authorizedRoutes, type MenuItem} from "../router";
import {DownOutlined, LoadingOutlined, MoonOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";

import styles from './BaseLayout.module.css';
import Footer from "../pages/Footer.tsx";

const BaseLayout = () => {
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => (state as RootState)?.global?.loading);

    const items: MenuProps['items'] = [
        {
            label: (
                <Flex gap={8} align='center' justify='flex-start'
                      onClick={() => navigate("/personal")}>
                    <UserOutlined></UserOutlined>
                    <Typography.Text>个人设置</Typography.Text>
                </Flex>
            ),
            key: '0',
        },
        {
            label: (
                <Flex gap={8} align='center' justify='flex-start'
                      onClick={() => navigate("/setting")}>
                    <SettingOutlined></SettingOutlined>
                    <Typography.Text>系统设置</Typography.Text>
                </Flex>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <Flex gap={8} align='center' justify='flex-start'
                      onClick={() => {
                          dispatch(clearToken());
                          navigate("/login", {replace: true});
                      }}>
                    <FaSignOutAlt/>
                    <Typography.Text>退出</Typography.Text>
                </Flex>
            ),
            key: '3',
        },
    ];

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
                        <Dropdown menu={{items}} trigger={['click']}>
                            <div onClick={(e) => e.preventDefault()}>
                                <Space>
                                    {store.getState().auth.userInfo.username}
                                    <DownOutlined/>
                                </Space>
                            </div>
                        </Dropdown>
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
