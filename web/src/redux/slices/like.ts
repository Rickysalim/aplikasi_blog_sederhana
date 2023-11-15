import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LikeState } from '../../@types/like';
import axios from '../../utils/axios';

const initialState: LikeState = {
    isLoading: false,
    is_like: false,
    like: 0,
}

const slice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        setStateIsLike(state, action) {
            state.is_like = action.payload.is_like
        },
        setStateLike(state, action) {
            state.like = action.payload.like
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(createLike.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createLike.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(createLike.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(checkLike.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(checkLike.fulfilled, (state, action) => {
            state.isLoading = false;
            state.is_like = action.payload.is_like
        })
        .addCase(checkLike.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(countLike.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(countLike.fulfilled, (state, action) => {
            state.isLoading = false;
            state.like = action.payload.like;
        })
        .addCase(countLike.rejected, (state) => {
            state.isLoading = false;
        })
    }
})

export const { setStateIsLike, setStateLike} = slice.actions

export default slice.reducer

export const countLike = createAsyncThunk(
    'countLike',
    async (data: any, { rejectWithValue }) => {
        try {

            const response: { data: any } = await axios.get(`/count/like/${data}`);
            console.log(response)
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const checkLike = createAsyncThunk(
    'checkLike',
    async (data: any, { rejectWithValue }) => {
        try {
            const response: { data: any } = await axios.get(`/check/like/${data}`);
            console.log(response)
            return response.data
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const createLike = createAsyncThunk(
    'createLike',
    async (data: any, { rejectWithValue }) => {
        try {
            const response: { data: any } = await axios.post('/like', {  
                post_id: data,
            });
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)