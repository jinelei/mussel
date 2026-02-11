import {Result, Button, Space} from 'antd';
import {HomeOutlined, ReloadOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'; // 若使用 react-router 路由

// 404 页面组件
const NotFound = () => {
    const navigate = useNavigate();

    // 返回主页方法
    const goToHome = () => {
        navigate('/'); // 跳转到主页路由，可根据你的实际路由调整
    };

    return (
        <div style={{padding: '50px 0', textAlign: 'center'}}>
            <Result
                status="404"
                title="404"
                subTitle="抱歉，你访问的页面不存在或已被删除。"
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<HomeOutlined/>}
                            onClick={goToHome}
                        >
                            返回主页
                        </Button>
                        <Button icon={<ReloadOutlined/>} onClick={() => window.location.reload()}>
                            刷新页面
                        </Button>
                    </Space>
                }
            />
        </div>
    );
};
export default NotFound;
