// const API_URL = "http://127.0.0.1:3000";
const API_URL = "https://api-apple.phuongdev.io.vn";

// products
export const API_URL_GET_ALL_PRODUCTS = `${API_URL}/products`;
export const API_URL_CREATE_PRODUCT = `${API_URL}/products`;
export const API_URL_UPDATE_PRODUCT = `${API_URL}/products`;
export const API_URL_DELETE_PRODUCT = `${API_URL}/products`;
export const API_URL_INCREASE_VIEW = `${API_URL}/products/increaseviews`;
export const API_URL_GET_PRODUCTS_BY_CATEGORY = `${API_URL}/products/category`;

//categorys
export const API_URL_GET_ALL_CATEGORYS = `${API_URL}/category`;
export const API_URL_CREATE_CATEGORY = `${API_URL}/category`;
export const API_URL_UPDATE_CATEGORY = `${API_URL}/category`;
export const API_URL_DELETE_CATEGORY = `${API_URL}/category`;
export const API_URL_CHANGE_ORDER_CATEGORY = `${API_URL}/category/order`;

//users
export const API_URL_GET_ALL_USERS = `${API_URL}/users`;
export const API_URL_UPDATE_USER = `${API_URL}/users`;
export const API_URL_UPDATE_PHONE = `${API_URL}/users/updatephone`;
export const API_REGISTER_USER = `${API_URL}/users/register`;
export const API_LOGIN_USER = `${API_URL}/users/login`;
export const API_LOGIN_USER_GOOGLE = `${API_URL}/users/loginGoogle`;
export const API_LOGIN_USER_FACEBOOK = `${API_URL}/users/loginFacebook`;
export const API_USER_ACCESS_TOKEN = `${API_URL}/users/user/accesstoken`;
export const API_USER_REFRESH_TOKEN = `${API_URL}/users/refreshToken`;
export const API_CHANGE_PASSWORD_USER = `${API_URL}/users/changePasswordPut`;
export const API_URL_GET_USER_BY_TOKEN = `${API_URL}/users/user`;
export const API_URL_FORGOT_PASSWORD = `${API_URL}/users/forgotPassword`;
export const API_URL_RESET_PASSWORD = `${API_URL}/users/resetPasswordPut`;

//contact
export const API_URL_SEND_CONTACT = `${API_URL}/users/sendContact`;

//orders
export const API_URL_GET_ALL_ORDERS = `${API_URL}/order`;
export const API_URL_CREATE_ORDER = `${API_URL}/order`;
export const API_URL_UPDATE_ORDER = `${API_URL}/order`;

//comments
export const API_URL_GET_ALL_COMMENT = `${API_URL}/comments`;
export const API_URL_GET_COMMENT_BY_PRODUCT = `${API_URL}/comments/product`;
export const API_URL_CREATE_COMMENT = `${API_URL}/comments`;
export const API_URL_UPDATE_COMMENT = `${API_URL}/comments`;
