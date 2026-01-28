// src/api/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
// 可选：结合 UI 库做全局提示（如 AntD/Element Plus）
import { message } from 'antd';

// 1. 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create({
    // 基础地址（建议从环境变量读取，避免硬编码）
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
    timeout: 10000, // 超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// 2. 请求拦截器：添加 Token、自定义请求头
axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 从本地存储获取登录 Token（登录后存储）
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            // 格式：Bearer + 空格 + Token（后端通用规范）
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// 3. 响应拦截器：统一处理响应/错误
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 直接返回响应体（简化业务层调用，无需 response.data）
        return response.data;
    },
    (error: AxiosError) => {
        // 统一错误提示
        const errMsg = error.response?.data?.msg || error.message || '请求失败';
        message.error(errMsg);

        // 特殊错误处理：Token 过期、无权限
        if (error.response?.status === 401) {
            message.error('Token 已过期，请重新登录');
            // 跳转到登录页
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // 抛出错误，让业务层捕获（可选）
        return Promise.reject(error);
    }
);

export default axiosInstance;
