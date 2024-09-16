import axios from "axios";

import {
  API_URL_GET_ALL_PRODUCTS,
  API_URL_CREATE_PRODUCT,
  API_URL_UPDATE_PRODUCT,
  API_URL_DELETE_PRODUCT,
  API_URL_GET_PRODUCTS_BY_CATEGORY,
  API_URL_INCREASE_VIEW,
} from "../constants/variables";

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_URL_GET_ALL_PRODUCTS}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (product) => {
  try {
    const res = await axios.post(`${API_URL_CREATE_PRODUCT}`, product);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL_UPDATE_PRODUCT}/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const res = await axios.delete(`${API_URL_DELETE_PRODUCT}/${productId}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${API_URL_GET_ALL_PRODUCTS}/${productId}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const res = await axios.get(
      `${API_URL_GET_PRODUCTS_BY_CATEGORY}/${categoryId}`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const increaseViewProduct = async (productId) => {
  try {
    await axios.put(`${API_URL_INCREASE_VIEW}/${productId}`);
  } catch (error) {
    console.log(error);
  }
};
