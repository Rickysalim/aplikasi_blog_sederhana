import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { WishListState } from '../../@types/wishlist';
import axios from '../../utils/axios';
import { dispatch, useSelector } from '../store';

const initialState: WishListState = {
    isLoading: false,
    query: {
        limit: 10,
        offset: 0,
        search: ''
    },
    page: 1,
    wishlist: {
        data: [],
        count: 0
    },
}

const slice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setSearchState(state, action) {
            state.query.search = action.payload
        },
        setPageState(state, action) {
            state.page = action.payload
        },
        setOffSetState(state, action) {
            state.query.offset = action.payload
        }
    },
    extraReducers(builder) {
        builder
        .addCase(getWishList.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getWishList.fulfilled, (state, action) => {
            state.isLoading = false;
            state.wishlist.data = action.payload?.data;
            state.wishlist.count = action.payload?.count;
        })
        .addCase(getWishList.rejected, (state) => {
            state.isLoading = false;
            state.wishlist = {
                data: [],
                count: 0
            };
        })

        .addCase(createWishList.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createWishList.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(createWishList.rejected, (state) => {
            state.isLoading = false;
        })

        .addCase(deleteWishList.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteWishList.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(deleteWishList.rejected, (state) => {
            state.isLoading = false;
        })
    },
})

export const { 
   setSearchState, setOffSetState, setPageState
} = slice.actions

export default slice.reducer;

export const getWishList = createAsyncThunk(
    'getWishList',
    async (data: any, { rejectWithValue }) => {
        try {
            const response: { data: any } = await axios.get(`/wishlist/me?offset=${data?.offset}&limit=${data?.limit}&search`);
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const createWishList = createAsyncThunk(
    'createWishList',
    async (data: any, { rejectWithValue }) => {
        try {
            const response:{ data: any } = await axios.post('/wishlist', {  
                post_id: data?.post_id,
                person_id: data?.person_id,
            });
            console.log(response)
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const deleteWishList = createAsyncThunk(
    'deleteWishList',
    async (data: any, { rejectWithValue }) => {
        try {
            const response:{ data: any } = await axios.delete(`/wishlist/${data}`);
            console.log(response)
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)