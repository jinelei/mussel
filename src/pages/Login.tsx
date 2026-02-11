import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Form, Input, Button, Typography,
    Card, Divider, message
} from 'antd';
import type {FormProps} from 'antd';
import {
    UserOutlined, LockOutlined, EyeTwoTone,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import {Service} from "../api";
import {useDispatch} from "react-redux";
import {clearToken, setPermissions, setRoles, setToken, setUserName, store} from '../store';
import styles from './Login.module.css';

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

    const rules = {
        username: [
            {required: true, message: '请输入用户名/手机号！'},
            {min: 3, message: '用户名长度不能少于3位！'}
        ],
        password: [
            {required: true, message: '请输入密码！'},
            {min: 6, message: '密码长度不能少于6位！'}
        ]
    }

    useEffect(() => {
        if (store.getState().auth.token) {
            navigate('/');
        }
    })

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Typography className={styles.title}>自留地</Typography>
                <Divider className={styles.divider}/>
                <Form<LoginFormValues>
                    form={form}
                    name="loginForm"
                    onFinish={onFinish}
                    autoComplete="off"
                    className={styles.form}
                >
                    <Form.Item name="username" className={styles.item} rules={rules.username}>
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="请输入用户名/手机号"
                            autoFocus
                        />
                    </Form.Item>

                    <Form.Item name="password" className={styles.item} rules={rules.password}>
                        <Input.Password
                            prefix={<LockOutlined/>}
                            placeholder="请输入密码"
                            iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                        />
                    </Form.Item>

                    <Form.Item className={styles.operation}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className={styles.login}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
};

export default Login;
