import axios from "axios";

import {
  API_URL_GET_ALL_COMMENT,
  API_URL_CREATE_COMMENT,
  API_URL_UPDATE_COMMENT,
} from "../constants/variables";

export const getAllComment = async () => {
  try {
    const res = await axios.get(`${API_URL_GET_ALL_COMMENT}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching comments: ", error);
  }
};

export const createComment = async (comment) => {
  try {
    const res = await axios.post(API_URL_CREATE_COMMENT, comment);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateComment = async (id, status) => {
  try {
    const res = await axios.put(`${API_URL_UPDATE_COMMENT}/${id}`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
