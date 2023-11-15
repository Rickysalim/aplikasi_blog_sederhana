import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Profile, ProfileState } from '../../@types/profile';
import axios from '../../utils/axios';

const initialState: ProfileState = {
    isLoading: false,
    profileState: {
        id: 0,
        fullname: '',
        image: '',
        phone_number: '',
        email: ''
    }
}

const slice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setStateProfile(state, action) {
            state.profileState.id = action.payload.id;
            state.profileState.fullname = action.payload.fullname;
            state.profileState.image = action.payload.image;
            state.profileState.phone_number = action.payload.phone_number;
            state.profileState.email = action.payload.email;
        }
    },
    extraReducers(builder) {
        builder.addCase(updateProfile.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(updateProfile.rejected, (state) => {
            state.isLoading = false;
        })
    },

})

export const { setStateProfile } = slice.actions

export default slice.reducer

export const updateProfile = createAsyncThunk(
    'updateProfile',
    async (data: Profile, { rejectWithValue }) => {
        try {
            const headers = {
                "Content-Type": "multipart/form-data"
            }
            const response: { data: any } = await axios.put('profile/me', data, {
                headers
            });
            return response.data && window.location.reload()
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

