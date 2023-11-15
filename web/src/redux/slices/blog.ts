import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BlogState, postState } from '../../@types/blog';
import axios from '../../utils/axios';

const initialState: BlogState = {
    isLoading: false,
    query: {
        limit: 10,
        offset: 0,
        search: ''
    },
    page: 1,
    postState: {
        id: 0,
        person_id: 0,
        title: '',
        content: '',
        created_at: '',
        image: '',
        description: ''
    },
    post: {
        data: [],
        count: 0
    },
    postByTitle: {
        data: {
            id: 0,
            person_id: 0,
            title: '',
            content: '',
            created_at: '',
            image: '',
            description: '',
            Person: {
                fullname: '',
            },
            comment: []
        },
    },
    postSearch: {
        data: [],
        count: 0
    }
}

const slice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setState(state, action) {
            state.postState.person_id = action.payload.person_id;
            state.postState.title = action.payload.title;
            state.postState.content = action.payload.content;
            state.postState.image = action.payload.image;
        },
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
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createBlog.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getPostData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPostData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post.data = action.payload?.data;
                state.post.count = action.payload?.count;
            })
            .addCase(getPostData.rejected, (state) => {
                state.isLoading = false;
                state.post = {
                    data: [],
                    count: 0
                };
            })
            .addCase(getPostDataByTitle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPostDataByTitle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postByTitle = action.payload
            })
            .addCase(getPostDataByTitle.rejected, (state) => {
                state.isLoading = false;
                state.postByTitle = {
                    data: null
                };
            })
            .addCase(getPostDataSearch.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPostDataSearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postSearch.data = action.payload?.data;
                state.postSearch.count = action.payload?.count;
            })
            .addCase(getPostDataSearch.rejected, (state) => {
                state.isLoading = false;
                state.postSearch = {
                    data: [],
                    count: 0
                };
            })
    }
})

export const {
    setSearchState, setOffSetState, setPageState
} = slice.actions;

export default slice.reducer

export const getPostDataSearch = createAsyncThunk(
    'postSearch',
    async (data, { rejectWithValue }) => {
        try {
            const response: { data: any } = await axios.get(`/post?offset=0&search`);
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const getPostData = createAsyncThunk(
    'post',
    async (data: any, { rejectWithValue }) => {
        try {
            const response: { data: any } = await axios.get(`/post?offset=${data?.offset}&limit=${data?.limit}&search=${data?.search || ''}`);
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const getPostDataByTitle = createAsyncThunk(
    'post/:title',
    async (data: string | undefined, { rejectWithValue }) => {
        try {
            const response: { data: any } = await axios.get(`/post/${data}`);
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const createBlog = createAsyncThunk(
    'createBlog',
    async (data: postState, { rejectWithValue }) => {
        try {
            const headers = {
                'Content-Type': 'multipart/form-data;boundary=<calculated when request is sent>',
                'Content-Length': '<calculated when request is sent>',
            }
            const response: { data: any } = await axios.post('/post', data, {
                headers
            });
            return response.data
        } catch (err) {
            throw rejectWithValue(err)
        }
    }
)