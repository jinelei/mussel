import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Form, Input, Button, Typography, Layout,
    Card, Divider, message, ConfigProvider
} from 'antd';
import type {FormProps} from 'antd';
import {
    UserOutlined, LockOutlined, EyeTwoTone,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import {Service} from "../api";
import {useDispatch} from "react-redux";
import {clearToken, setPermissions, setRoles, setToken, setUserName, store} from '../store';


const {Title} = Typography;
const {Content} = Layout;

interface LoginFormValues {
    username: string;
    password: string;
    remember: boolean;
}

const Login: React.FC = () => {
    const [form] = Form.useForm<LoginFormValues>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            const token = await Service.postLogin({...values});
            if (token.code !== 200) {
                dispatch(clearToken());
                message.error('账号或密码错误，请重试！');
            } else {
                dispatch(setToken(token.data));
                const userInfo = await Service.getUserInfo();
                if (userInfo.code !== 200) {
                    dispatch(clearToken());
                    message.error('获取用户信息失败');
                } else {
                    dispatch(setUserName(userInfo.data.username));
                    dispatch(setRoles(userInfo.data.roles));
                    dispatch(setPermissions(userInfo.data.permissions));
                    message.success('登录成功！');
                    navigate('/', {replace: true});
                }
            }
            setLoading(false);
        } catch (err) {
            console.error("err", err);
            message.error('登录失败，请稍后再试！');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (store.getState().auth.token) {
            navigate('/');
        }
    })

    return (
        <ConfigProvider locale={zhCN}>
            <Layout style={{
                minHeight: 'clamp(600px, 100dvh, 100vh)',
                height: 'auto',
                overflowY: 'hidden',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Content>
                    <Card styles={{header: {border: 0}}} style={{
                        width: 'clamp(20rem, 80vw, 500px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        borderRadius: 12,
                        marginTop: '5rem',
                        overflow: 'hidden'
                    }}>
                        {/* 登录页头部 */}
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem 0',
                            marginBottom: '1rem'
                        }}>
                            <Title level={2} style={{margin: 0, color: '#1890ff'}}>
                                自留地
                            </Title>
                        </div>

                        <Divider style={{margin: '0 0 2rem 0'}}/>

                        {/* 登录表单（绑定类型） */}
                        <Form<LoginFormValues>
                            form={form}
                            name="loginForm"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {required: true, message: '请输入用户名/手机号！'},
                                    {min: 3, message: '用户名长度不能少于3位！'}
                                ]}
                                style={{margin: '2rem 0'}}
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
                                style={{margin: '2rem 0'}}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    placeholder="请输入密码"
                                    iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                />
                            </Form.Item>

                            <Form.Item style={{margin: '1rem 0'}}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    size="large"
                                    style={{height: 48, borderRadius: 8}}
                                >
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Content>
            </Layout>
        </ConfigProvider>
    )
};

export default Login;
