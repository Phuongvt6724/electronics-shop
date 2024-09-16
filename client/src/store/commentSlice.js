import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAllComment,
  createComment,
  updateComment,
} from "../utils/api/commentApi";

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async () => {
    const response = await getAllComment();
    return response;
  }
);

export const selectCommentsByProduct = (state, productId) =>
  state.comment.comments.filter(
    (comment) => comment.productId === productId && comment.status === 1
  );

export const addComment = createAsyncThunk(
  "comment/addComment",
  async (comment) => {
    const response = await createComment(comment);
    return response;
  }
);

export const updateCommentStatus = createAsyncThunk(
  "comment/updateCommentStatus",
  async ({ id, status }) => {
    const response = await updateComment(id, status);
    return response;
  }
);

const initialState = {
  comments: [],
  status: "idle",
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // Các reducer khác ở đây
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      .addCase(updateCommentStatus.fulfilled, (state, action) => {
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        );
      });
  },
});

export default commentSlice.reducer;
