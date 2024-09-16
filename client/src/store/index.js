import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice";
import productSlice from "./productSlice";
import categorySlice from "./categorySlice";
import cartSlice from "./cartSlice";
import userSlice from "./userSlice";
import orderSlice from "./orderSlice";
import commentSlice from "./commentSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    product: productSlice,
    category: categorySlice,
    cart: cartSlice,
    user: userSlice,
    order: orderSlice,
    comment: commentSlice,
  },
});

let prevState = store.getState();

store.subscribe(() => {
  let currentState = store.getState();
  if (currentState.cart !== prevState.cart) {
    localStorage.setItem("cart", JSON.stringify(currentState.cart.cart));
  }
  prevState = currentState;
});

export default store;
