import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  changeOrderCategory,
} from "../utils/api/categoryApi";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const response = await getAllCategories();
    return response;
  }
);

export const addNewCategory = createAsyncThunk(
  "category/addNewCategory",
  async (initialCategory) => {
    const response = await createCategory(initialCategory);
    return response;
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "category/updateCategory",
  async ({ id, category }) => {
    const response = await updateCategory(id, category);
    return response;
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "category/deleteCategory",
  async (id) => {
    const response = await deleteCategory(id);
    return response;
  }
);

export const changeOrderCategoryAsync = createAsyncThunk(
  "category/changeOrderCategory",
  async ({ id, direction }) => {
    const response = await changeOrderCategory(id, direction);
    return response;
  }
);

const initialState = {
  categories: [],
  status: "idle",
  statusAdd: "idle",
  statusUpdate: "idle",
  statusDelete: "idle",
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Các reducer khác ở đây
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // add new category
      .addCase(addNewCategory.pending, (state) => {
        state.statusAdd = "loading";
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.statusAdd = "succeeded";
        state.categories.push(action.payload);
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.statusAdd = "failed";
        state.error = action.error.message;
      })

      // update category
      .addCase(updateCategoryAsync.pending, (state) => {
        state.statusUpdate = "loading";
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.statusUpdate = "succeeded";
        const { _id, Name } = action.payload;
        const existingCategory = state.categories.find(
          (category) => category._id === _id
        );
        if (existingCategory) {
          existingCategory.Name = Name;
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.statusUpdate = "failed";
        state.error = action.error.message;
      })

      // remove category
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.statusDelete = "loading";
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.statusDelete = "succeeded";
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.statusDelete = "failed";
        state.error = action.error.message;
      })

      // change order category
      .addCase(changeOrderCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changeOrderCategoryAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(changeOrderCategoryAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
