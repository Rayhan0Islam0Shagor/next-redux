import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { REHYDRATE } from 'reduxjs-toolkit-persist';

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
  return fetch(`https://jsonplaceholder.typicode.com/posts`).then((res) =>
    res.json()
  );
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    list: [],
    status: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(REHYDRATE, (state, action) => {
        console.log('in rehydrate');
      })
      .addCase(getPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export default postsSlice.reducer;
