import axios from "axios";

import {
  API_URL_CREATE_ORDER,
  API_URL_GET_ALL_ORDERS,
  API_URL_UPDATE_ORDER,
} from "../constants/variables";

export const getAllOrders = async () => {
  try {
    const res = await axios.get(API_URL_GET_ALL_ORDERS);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createOrder = async (order) => {
  try {
    const res = await axios.post(API_URL_CREATE_ORDER, order);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const paymentVnpay = async (order) => {
  try {
    const res = await axios.post(
      `${API_URL_CREATE_ORDER}/create_payment_url`,
      order
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateOrder = async (id, status) => {
  try {
    const res = await axios.put(`${API_URL_UPDATE_ORDER}/${id}`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
