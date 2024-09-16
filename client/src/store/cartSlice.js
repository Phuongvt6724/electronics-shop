import { createSlice } from "@reduxjs/toolkit";

const getItemCartLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(cart);
  }
  return [];
};

const initialState = {
  cart: getItemCartLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const index = state.cart.findIndex(
        (item) => item._id === newItem._id && item.color === newItem.color
      );
      if (index === -1) {
        state.cart.unshift(newItem);
      } else {
        if (
          state.cart[index].quantity + newItem.quantity >
          state.cart[index].quantityStock
        ) {
          state.cart[index].quantity = state.cart[index].quantityStock;
          return;
        }
        state.cart[index].quantity += newItem.quantity;
      }
    },
    removeFromCart: (state, action) => {
      const { idNeedToRemove, ColorNeedToRemove } = action.payload;
      state.cart = state.cart.filter(
        (item) =>
          item._id !== idNeedToRemove || item.color !== ColorNeedToRemove
      );
    },
    changeQuantity: (state, action) => {
      const { id, color, quantity } = action.payload;
      const index = state.cart.findIndex(
        (item) => item._id === id && item.color === color
      );
      state.cart[index].quantity = quantity;
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const getTotalPrice = (state) => {
  return state.cart.cart.reduce(
    (total, item) => total + item.priceNow * item.quantity,
    0
  );
};

export const getTotalQuantity = (state) => {
  return state.cart.cart.reduce((total, item) => total + item.quantity, 0);
};

export const { addToCart, removeFromCart, changeQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
