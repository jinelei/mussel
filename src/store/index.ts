import {configureStore, createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'token',
    initialState: {
        token: localStorage.getItem('token') || ''
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload; // Redux 中更新
            localStorage.setItem('token', action.payload); // 同步到本地存储
        },
        clearToken: (state) => {
            state.token = '';
            localStorage.removeItem('token');
        }
    }
});

export const {setToken, clearToken} = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
});
