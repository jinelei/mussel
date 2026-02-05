import {createSlice} from '@reduxjs/toolkit';

export interface GlobalState {
    loading: boolean;
}

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        loading: false,
    } as GlobalState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const actions = globalSlice.actions;
export const reducer = globalSlice.reducer;
