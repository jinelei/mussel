import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
    token: string;
    loading: boolean;
    userInfo: {
        username: string;
        roles: string[];
        permissions: string[];
    };
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || '',
        loading: false,
        userInfo: {
            username: localStorage.getItem('username') || '',
            roles: localStorage.getItem('roles') || [],
            permissions: localStorage.getItem('permissions') || [],
        },
    } as AuthState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        clearToken: (state) => {
            state.token = '';
            state.userInfo.username = '';
            state.userInfo.roles = [];
            state.userInfo.permissions = [];
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('roles');
            localStorage.removeItem('permissions');
        },
        setUserName: (state, action) => {
            state.userInfo.username = action.payload;
            localStorage.setItem('username', action.payload);
        },
        setRoles: (state, action) => {
            state.userInfo.roles = action.payload;
            localStorage.setItem('roles', JSON.stringify(action.payload));
        },
        setPermissions: (state, action) => {
            state.userInfo.permissions = action.payload;
            localStorage.setItem('permissions', JSON.stringify(action.payload));
        },
        setLoading: (state, action) => {
            console.log('set loading', action.payload);
            state.loading = action.payload;
        }
    }
});

export const actions = authSlice.actions;

export const reducer = authSlice.reducer;
