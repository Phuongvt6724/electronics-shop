import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  getAllProducts,
  increaseViewProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../utils/api/productApi";

// Tạo thunk action
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const response = await getAllProducts();
    return response;
  }
);

export const addNewProduct = createAsyncThunk(
  "product/addNewProduct",
  async (product) => {
    const response = await createProduct(product);
    return response;
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }) => {
    const response = await updateProduct(id, data);
    return response;
  }
);

export const deleteProductAsync = createAsyncThunk(
  "product/deleteProduct",
  async (productId) => {
    const response = await deleteProduct(productId);
    return response;
  }
);

export const increaseView = createAsyncThunk(
  "product/increaseView",
  async (productId) => {
    await increaseViewProduct(productId);
    return productId;
  }
);

export const selectHotProducts = createSelector(
  (state) => state.product.products,
  (products) => products.filter((product) => product.hot === true)
);

export const selectProductsByCategory = (state, categoryId) =>
  state.product.products.filter((product) => product.brand === categoryId);

export const selectProductsBySearch = (state, searchValue) =>
  state.product.products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );

const initialState = {
  products: [],
  status: "idle",
  addStatus: "idle",
  fixStatus: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Các reducer khác ở đây
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(increaseView.fulfilled, (state, action) => {
        const productId = action.payload;
        state.products = state.products.map((product) =>
          product._id === productId
            ? { ...product, views: product.views + 1 }
            : product
        );
      })

      // Thêm sản phẩm mới vào danh sách
      .addCase(addNewProduct.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.products.push(action.payload);
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.error.message;
      })

      // Cập nhật thông tin sản phẩm
      .addCase(updateProductAsync.pending, (state) => {
        state.fixStatus = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.fixStatus = "succeeded";
        const updatedProduct = action.payload;
        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.fixStatus = "failed";
        state.error = action.error.message;
      })

      // Xoá sản phẩm khỏi danh sách
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        const productId = action.payload;
        state.products = state.products.filter(
          (product) => product._id !== productId
        );
      });
  },
});

export default productSlice.reducer;
