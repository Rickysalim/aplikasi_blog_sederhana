import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import blogReducer from './slices/blog';
import commentReducer from './slices/comment';
import likeReducer from './slices/like';
import profileReducer from './slices/profile';
import wishlistReducer from './slices/wishlist';

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: [],
};

const rootReducer = combineReducers({
   blog: blogReducer,
   comment: commentReducer,
   like: likeReducer,
   profile: profileReducer,
   wishlist: wishlistReducer
});

export { rootPersistConfig, rootReducer}