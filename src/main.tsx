import {StrictMode} from 'react'
import {RouterProvider} from 'react-router-dom';
import {createRoot} from 'react-dom/client'
import {router} from './router';
import {store} from './store';
import './index.css'
import {Provider} from "react-redux";
import {OpenAPI} from "./api";
import axios from "axios";

axios.interceptors.response.use(
    (response) => {
        console.log('response', response)
        if (response?.status === 401 || response?.data?.code === 401) {
            console.error("未登录")
            store.dispatch({type: 'auth/clearToken'});
            window.location.href = '/login';
        } else if (response?.status === 403 || response?.data?.code === 403) {
            console.error("无权限访问")
            alert('无权限访问');
        }
        return response;
    },
    (error) => {
        const {response} = error;
        if (response?.status === 401 || response?.data?.code === 401) {
            console.error("未登录")
            store.dispatch({type: 'auth/clearToken'});
            window.location.href = '/login';
        } else if (response?.status === 403 || response?.data?.code === 403) {
            console.error("无权限访问")
            alert('无权限访问');
        }
        return Promise.reject(error);
    }
);

console.log("interceptors", axios.interceptors.response);
OpenAPI.BASE = '/api';
OpenAPI.TOKEN = async () => store.getState().auth.token;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider
                router={router}
            />
        </Provider>
    </StrictMode>,
)
