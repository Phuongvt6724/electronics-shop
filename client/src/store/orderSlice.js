import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  getAllOrders,
  updateOrder,
  paymentVnpay,
} from "../utils/api/orderApi";

export const getAllOrdersAsync = createAsyncThunk(
  "order/getAllOrders",
  async () => {
    return getAllOrders();
  }
);

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    return createOrder(order);
  }
);

export const paymentVnpayAsync = createAsyncThunk(
  "order/paymentVnpay",
  async (order) => {
    return paymentVnpay(order);
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }) => {
    return updateOrder(id, status);
  }
);

const initialState = {
  order: [],
  payment_url: "",
  statusUpdate: "idle",
  statusPaymentVnpay: "idle",
  status: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Các reducer khác ở đây
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách đơn hàng
      .addCase(getAllOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllOrdersAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })

      // Tạo thanh toán Vnpay
      .addCase(paymentVnpayAsync.pending, (state) => {
        state.statusPaymentVnpay = "loading";
      })
      .addCase(paymentVnpayAsync.fulfilled, (state, action) => {
        state.statusPaymentVnpay = "succeeded";
        state.payment_url = action.payload.paymentUrl;
      })

      // Tạo đơn hàng
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order.push(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Cập nhật trạng thái đơn hàng
      .addCase(updateOrderAsync.pending, (state) => {
        state.statusUpdate = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.statusUpdate = "succeeded";
        const updatedOrder = action.payload;
        state.order = state.order.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      });
  },
});

export default orderSlice.reducer;
