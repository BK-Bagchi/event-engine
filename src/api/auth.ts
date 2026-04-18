import axios from "./axiosInstance";

const base = () => `/auth`;

/** POST /auth/register */
export const register = (data: {
  fullName: string;
  email: string;
  passwordHash: string;
}) => axios.post(`${base()}/register`, data);

/** POST /auth/login */
export const login = (data: { email: string; passwordHash: string }) =>
  axios.post(`${base()}/login`, data);

/** POST /auth/oauth-login */
export const oauthLogin = (data: { token: string }) =>
  axios.post(`${base()}/oauth-login`, data);

/** POST /auth/send-password-reset-otp */
export const sendPasswordResetOTP = (data: { email: string }) =>
  axios.post(`${base()}/send-password-reset-otp`, data);

/** POST /auth/verify-password-reset-otp */
export const verifyPasswordResetOTP = (data: { userId: string; otp: string }) =>
  axios.post(`${base()}/verify-password-reset-otp`, data);

/** POST /auth/reset-password */
export const resetPassword = (data: {
  userId: string;
  otpId: string;
  newPassword: string;
}) => axios.post(`${base()}/reset-password`, data);

/** POST /auth/change-password — requires auth token */
export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => axios.post(`${base()}/change-password`, data);

/** POST /auth/logout — requires auth token */
export const logout = () => axios.post(`${base()}/logout`);
