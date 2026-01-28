import {Outlet, Link, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {FaHome, FaUser, FaCog, FaSignOutAlt} from 'react-icons/fa';

const BaseLayout = () => {
    const location = useLocation();

    useEffect(() => {
        console.log('当前页面路径：', location.pathname);

        const isLogin = localStorage.getItem('token');
        if (!isLogin && location.pathname !== '/login') {
            // 未登录则跳转到登录页
            window.location.href = '/login';
        }
    }, [location]);

    const menuList = [
        {path: '/', label: '首页', icon: <FaHome/>},
        {path: '/dashboard', label: '仪表盘', icon: <FaUser/>},
        {path: '/settings', label: '系统设置', icon: <FaCog/>},
    ];

    return (
        <div style={{display: 'flex', height: '100vh', margin: 0, padding: 0}}>
            <aside
                style={{
                    width: '200px',
                    background: '#2c3e50',
                    color: 'white',
                    padding: '20px 0',
                }}
            >
                {/* 侧边栏标题 */}
                <div style={{padding: '0 20px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px'}}>
                    系统管理后台
                </div>

                {/* 导航菜单 */}
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {menuList.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 20px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    // 高亮当前激活的导航项
                                    background: location.pathname === item.path ? '#34495e' : 'transparent',
                                }}
                                // 可选：点击导航时阻止默认行为（非必需）
                                onClick={(e) => e.preventDefault()}
                            >
                                <span style={{marginRight: '10px'}}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* 退出登录按钮（示例） */}
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
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                    >
                        <FaSignOutAlt style={{marginRight: '5px'}}/> 退出登录
                    </button>
                </div>
            </aside>

            {/* ========== 右侧主内容区 ========== */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {/* 顶部导航栏 */}
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
                    <div>用户名：管理员</div>
                </header>

                {/* ========== 子路由渲染区域（核心） ========== */}
                {/* Outlet 是 React Router 提供的组件，会自动渲染匹配的子路由组件 */}
                <main style={{flex: 1, padding: '20px', overflow: 'auto'}}>
                    <Outlet/>
                </main>

                {/* 页脚（可选） */}
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
                    © 2026 系统管理后台 - 版权所有
                </footer>
            </div>
        </div>
    );
}

export default BaseLayout;
