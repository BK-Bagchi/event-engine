import axios from "./axiosInstance";

type ProviderType = "GMAIL" | "OUTLOOK" | "SMTP" | "RESEND" | "SENDGRID";

const base = (projectId: string) => `/service/projects/${projectId}/services`;

/** POST /service/services */
export const getAllServices = () => axios.get(`/service/services`);

/** POST /service/projects/:projectId/services */
export const createService = (
  projectId: string,
  data: { name: string; providerType: ProviderType; isDefault?: boolean },
) => axios.post(`${base(projectId)}`, data);

/** GET /service/projects/:projectId/services */
export const getProjectServices = (projectId: string) =>
  axios.get(`${base(projectId)}`);

/** GET /service/projects/:projectId/services/:serviceId */
export const getService = (projectId: string, serviceId: string) =>
  axios.get(`${base(projectId)}/${serviceId}`);

/** PATCH /service/projects/:projectId/services/:serviceId */
export const updateServiceInfo = (
  projectId: string,
  serviceId: string,
  data: { name?: string; providerType?: ProviderType; isDefault?: boolean },
) => axios.patch(`${base(projectId)}/${serviceId}`, data);

/** PATCH /service/projects/:projectId/services/:serviceId/status */
export const updateServiceStatus = (
  projectId: string,
  serviceId: string,
  data: { status: string },
) => axios.patch(`${base(projectId)}/${serviceId}/status`, data);
