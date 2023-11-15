import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CommentState, Comment } from '../../@types/comment';
import axios from '../../utils/axios';

const initialState: CommentState = {
    isLoading: false,
    commentState: {
        id: 0,
        post_id: 0,
        person_id: '',
        image: '',
        comment: '',
        created_at: '',
        parent_id: null
    },
    comment: {
        data:[],
        count: 0
    }
}

const slice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setCommentState(state, action) {
            state.commentState.comment = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(findOneComment.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(findOneComment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.comment.data = action.payload.data; 
            state.comment.count = action.payload.count;
        })
        builder.addCase(findOneComment.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(postComment.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(postComment.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(postComment.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(editComment.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(editComment.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(editComment.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(deleteComment.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(deleteComment.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(deleteComment.rejected, (state) => {
            state.isLoading = false;
        })
    }
})

export const {
    setCommentState
} = slice.actions;

export default slice.reducer

export const findOneComment = createAsyncThunk(
    'findOneComment',
    async (id: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`/comment/${id}`);
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const postComment = createAsyncThunk(
    'postComment',
    async (data: Comment, { rejectWithValue }) => {
        try {
            const response: any = await axios.post('/comment', {  
                post_id: data?.post_id,
                person_id: data?.person_id,
                comment: data?.comment,
                parent_id: data?.id
            });
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const editComment = createAsyncThunk(
    'editComment',
    async (data: Comment, { rejectWithValue }) => {
        try {
            const response: any = await axios.put(`/comment/${data?.id}`, { comment: data?.comment });
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const deleteComment = createAsyncThunk(
    'deleteComment',
    async (data: Comment, { rejectWithValue }) => {
        try {
            console.log(data?.parent_id)
            if(data?.parent_id === null) {
                const response: any = await axios.delete(`/comment/${data?.id}/${data?.id}`);
                return response.data;
            }
            const response: any = await axios.delete(`/comment/${data?.id}`);
            return response.data;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)