import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Form, Input, Button, Checkbox, Typography, Layout,
    Card, Divider, Space, message, ConfigProvider
} from 'antd';
import type {FormProps} from 'antd';
import {
    UserOutlined, LockOutlined, EyeTwoTone,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN'; // 引入中文语言包
import 'antd/dist/reset.css'; // AntD v5 样式文件

const {Title, Text, Link} = Typography;
const {Content} = Layout;

// 定义表单值的类型接口（核心：TS 类型约束）
interface LoginFormValues {
    username: string;
    password: string;
    remember: boolean;
}

// 定义本地存储的用户信息类型
interface SavedUserInfo {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [form] = Form.useForm<LoginFormValues>(); // 绑定表单类型
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // 监听窗口大小，判断是否为手机端
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        const handleResize = () => checkMobile();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 表单提交处理（添加类型约束）
    const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            // 模拟登录请求（实际项目替换为真实接口）
            await new Promise<void>((resolve) => setTimeout(resolve, 1000));

            // 模拟校验账号密码
            if (values.username === 'admin' && values.password === '123456') {
                // 记住密码逻辑（类型安全的 localStorage 操作）
                if (values.remember) {
                    const userInfo: SavedUserInfo = {
                        username: values.username,
                        password: values.password
                    };
                    localStorage.setItem('loginUser', JSON.stringify(userInfo));
                } else {
                    localStorage.removeItem('loginUser');
                }

                // 存储token
                localStorage.setItem('token', 'your-real-token-here');
                message.success('登录成功！');
                navigate('/', {replace: true});
            } else {
                message.error('账号或密码错误，请重试！');
            }
        } catch (error) {
            message.error('登录失败，请稍后再试！');
            console.error('登录请求失败：', error);
        } finally {
            setLoading(false);
        }
    };

    // 初始化表单（填充记住的密码，添加类型校验）
    useEffect(() => {
        const savedUserStr = localStorage.getItem('loginUser');
        if (savedUserStr) {
            try {
                const savedUser: SavedUserInfo = JSON.parse(savedUserStr);
                // 校验解析后的数据结构，避免类型错误
                if (savedUser.username && savedUser.password) {
                    form.setFieldsValue({
                        username: savedUser.username,
                        password: savedUser.password,
                        remember: true
                    });
                }
            } catch (e) {
                console.error('解析记住的用户信息失败：', e);
                localStorage.removeItem('loginUser'); // 清除错误的存储数据
            }
        }
    }, [form]);

    // 布局样式（使用 TS 的对象类型推导）
    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: isMobile
            ? '#f5f5f5'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const cardStyle: React.CSSProperties = {
        width: isMobile ? '100%' : 400,
        boxShadow: isMobile
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : '0 10px 30px rgba(0,0,0,0.2)',
        borderRadius: 12,
        overflow: 'hidden'
    };

    const formItemStyle: React.CSSProperties = {
        marginBottom: '16px'
    };

    return (
        <ConfigProvider locale={zhCN}>
            <Layout style={containerStyle}>
                <Content>
                    <Card style={cardStyle} bordered={false}>
                        {/* 登录页头部 */}
                        <div style={{
                            textAlign: 'center',
                            padding: isMobile ? '20px 0' : '30px 0',
                            marginBottom: isMobile ? '10px' : '20px'
                        }}>
                            <Title level={2} style={{margin: 0, color: '#1890ff'}}>
                                系统管理后台
                            </Title>
                            <Text type="secondary" style={{marginTop: 8, display: 'block'}}>
                                欢迎登录，体验高效的管理系统
                            </Text>
                        </div>

                        <Divider style={{margin: '0 0 20px 0'}}/>

                        {/* 登录表单（绑定类型） */}
                        <Form<LoginFormValues>
                            form={form}
                            name="loginForm"
                            onFinish={onFinish}
                            autoComplete="off"
                            size={isMobile ? 'large' : 'middle'}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {required: true, message: '请输入用户名/手机号！'},
                                    {min: 3, message: '用户名长度不能少于3位！'}
                                ]}
                                style={formItemStyle}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    placeholder="请输入用户名/手机号"
                                    autoFocus
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {required: true, message: '请输入密码！'},
                                    {min: 6, message: '密码长度不能少于6位！'}
                                ]}
                                style={formItemStyle}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    placeholder="请输入密码"
                                    iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                />
                            </Form.Item>

                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                initialValue={false}
                                style={{marginBottom: '24px'}}
                            >
                                <Space>
                                    <Checkbox>记住密码</Checkbox>
                                    <Link href="#" style={{marginLeft: 'auto'}}>
                                        忘记密码？
                                    </Link>
                                </Space>
                            </Form.Item>

                            <Form.Item style={{marginBottom: 0}}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    size="large"
                                    style={{
                                        height: 48,
                                        borderRadius: 8,
                                        fontSize: isMobile ? '16px' : '14px'
                                    }}
                                >
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* 底部链接 */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            paddingBottom: '20px'
                        }}>
                            <Text type="secondary">
                                还没有账号？<Link href="#">立即注册</Link>
                            </Text>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default Login;
