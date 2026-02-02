import {configureStore, createSlice} from '@reduxjs/toolkit';

interface AuthState {
    token: string;
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
            localStorage.setItem('roles', action.payload);
        },
        setPermissions: (state, action) => {
            state.userInfo.permissions = action.payload;
            localStorage.setItem('permissions', action.payload);
        }
    }
});

export const {setToken, clearToken, setUserName, setRoles, setPermissions} = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
});
