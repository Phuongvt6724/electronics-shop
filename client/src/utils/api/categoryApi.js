import axios from "axios";

import {
  API_URL_GET_ALL_CATEGORYS,
  API_URL_CREATE_CATEGORY,
  API_URL_UPDATE_CATEGORY,
  API_URL_DELETE_CATEGORY,
  API_URL_CHANGE_ORDER_CATEGORY,
} from "../constants/variables";

export const getAllCategories = async () => {
  try {
    const res = await axios.get(API_URL_GET_ALL_CATEGORYS);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories: ", error);
  }
};

export const createCategory = async (category) => {
  try {
    const res = await axios.post(API_URL_CREATE_CATEGORY, category);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateCategory = async (id, category) => {
  console.log("updateCategory", id, category);
  try {
    const res = await axios.put(`${API_URL_UPDATE_CATEGORY}/${id}`, category);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axios.delete(`${API_URL_DELETE_CATEGORY}/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const changeOrderCategory = async (id, direction) => {
  try {
    const res = await axios.put(`${API_URL_CHANGE_ORDER_CATEGORY}/${id}`, {
      direction,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
