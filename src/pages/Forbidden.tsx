import {Result, Button} from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'; // 若使用 react-router 路由

const Forbidden = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div style={{padding: '50px 0', textAlign: 'center'}}>
            <Result
                status="403"
                title="403"
                subTitle="抱歉，你没有权限访问该页面，请联系管理员获取权限。"
                extra={
                    <Button
                        type="primary"
                        icon={<HomeOutlined/>}
                        onClick={goToHome}
                    >
                        返回主页
                    </Button>
                }
            />
        </div>
    );
};

export default Forbidden;
