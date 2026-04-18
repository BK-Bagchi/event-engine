import axios from "./axiosInstance";

const base = () => `/user`;

/** GET /user/profile */
export const getProfile = () => axios.get(`${base()}/profile`);

/** PATCH /user/profile */
export const updateProfile = (data: {
  fullName?: string;
  timezone?: string;
  avatar?: string;
}) => axios.patch(`${base()}/profile`, data);

/** POST /user/email-verification-otp */
export const sendEmailVerificationOTP = () =>
  axios.post(`${base()}/email-verification-otp`);

/** POST /user/verify-email */
export const verifyEmail = (data: { otp: string }) =>
  axios.post(`${base()}/verify-email`, data);
