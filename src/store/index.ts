import {configureStore} from '@reduxjs/toolkit';
import {reducer as globalReducer, actions as globalActions} from './global.ts';
import {reducer as authReducer, actions as authActions} from './auth.ts';

export const store = configureStore({
    reducer: {
        global: globalReducer,
        auth: authReducer,
    }
});

export const {setToken, clearToken, setUserName, setRoles, setPermissions} = authActions;
export const {setLoading} = globalActions;

// 🔴 核心1：定义Store根状态类型 RootState（自动推导，无需手动写所有属性）
// ReturnType<typeof store.getState> 会自动提取store.getState()的返回值类型
export type RootState = ReturnType<typeof store.getState>;

// 🔴 核心2：定义Store调度函数类型 AppDispatch（自动推导，支持异步Action）
// store.dispatch 的类型，包含Redux Toolkit内置的thunk中间件类型
export type AppDispatch = typeof store.dispatch;
