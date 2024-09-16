import axios from "axios";

import {
  API_URL_GET_ALL_USERS,
  API_URL_UPDATE_USER,
  API_URL_UPDATE_PHONE,
  API_REGISTER_USER,
  API_LOGIN_USER,
  API_LOGIN_USER_GOOGLE,
  API_LOGIN_USER_FACEBOOK,
  API_USER_ACCESS_TOKEN,
  API_USER_REFRESH_TOKEN,
  API_CHANGE_PASSWORD_USER,
  API_URL_GET_USER_BY_TOKEN,
  API_URL_FORGOT_PASSWORD,
  API_URL_RESET_PASSWORD,
  API_URL_SEND_CONTACT,
} from "../constants/variables";

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${API_URL_GET_ALL_USERS}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateUser = async (id, status) => {
  try {
    const res = await axios.put(`${API_URL_UPDATE_USER}/${id}`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const registerUser = async (user) => {
  try {
    const res = await axios.post(`${API_REGISTER_USER}`, user);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const loginUser = async (user) => {
  try {
    const res = await axios.post(`${API_LOGIN_USER}`, user);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const loginUserGoogle = async (token) => {
  try {
    const res = await axios.post(`${API_LOGIN_USER_GOOGLE}`, { token });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const loginUserFacebook = async (token) => {
  try {
    const res = await axios.post(`${API_LOGIN_USER_FACEBOOK}`, { token });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getInformationUser = async (accessToken, refreshToken) => {
  try {
    const res = await axios.get(`${API_USER_ACCESS_TOKEN}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    if (error.response.status === 403) {
      // Access token hết hạn
      try {
        // Sử dụng refresh token để lấy lại access token
        const { accessToken: newAccessToken } = await handleRefreshToken(
          refreshToken
        );
        // Lưu access token mới vào localStorage
        localStorage.setItem("accessToken", newAccessToken);
        // Thử lại lấy thông tin người dùng
        const res = await axios.get(`${API_USER_ACCESS_TOKEN}`, {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
        return res.data;
      } catch (refreshError) {
        throw new Error(refreshError.response.data.message);
      }
    } else {
      throw new Error(error.response.data.message);
    }
  }
};

export const handleRefreshToken = async (refreshToken) => {
  try {
    const res = await axios.post(`${API_USER_REFRESH_TOKEN}`, {
      refreshToken,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const changePasswordUser = async (id, oldPassword, newPassword) => {
  try {
    const res = await axios.put(`${API_CHANGE_PASSWORD_USER}/${id}`, {
      oldPassword,
      newPassword,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const checkUrlToken = async (token) => {
  try {
    const res = await axios.get(`${API_URL_GET_USER_BY_TOKEN}/${token}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updatePhone = async (id, phone) => {
  try {
    const res = await axios.put(`${API_URL_UPDATE_PHONE}/${id}`, { phone });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const sendContact = async (name, email, message) => {
  try {
    const res = await axios.post(`${API_URL_SEND_CONTACT}`, {
      name,
      email,
      message,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API_URL_FORGOT_PASSWORD}`, { email });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const resetPassword = async (id, password) => {
  try {
    const res = await axios.put(`${API_URL_RESET_PASSWORD}/${id}`, {
      password,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
