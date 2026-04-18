import axios from "./axiosInstance";

const base = () => `/project/projects`;

/** POST /project/projects */
export const createProject = (data: {
  name: string;
  allowedOrigins: string[];
  description?: string;
  settings?: {
    saveSubmissions?: boolean;
    enableAutoReply?: boolean;
    enableWebhook?: boolean;
    requireCaptcha?: boolean;
    rateLimitPerMinute?: number;
    maxAttachmentSizeMB?: number;
  };
}) => axios.post(`${base()}`, data);

/** GET /project/projects */
export const getAllProjects = () => axios.get(`${base()}`);

/** GET /project/projects/:projectId */
export const getProject = (projectId: string) =>
  axios.get(`${base()}/${projectId}`);

/** PATCH /project/projects/:projectId/info */
export const updateProjectInfo = (
  projectId: string,
  data: { name?: string; description?: string },
) => axios.patch(`${base()}/${projectId}/info`, data);

/** PATCH /project/projects/:projectId/status */
export const updateProjectStatus = (
  projectId: string,
  data: { status: "ACTIVE" | "ARCHIVED" },
) => axios.patch(`${base()}/${projectId}/status`, data);

/** POST /project/projects/:projectId/regenerate-public-key */
export const regeneratePublicKey = (projectId: string) =>
  axios.post(`${base()}/${projectId}/regenerate-public-key`);

/** POST /project/projects/:projectId/regenerate-secret-key */
export const regenerateSecretKey = (projectId: string) =>
  axios.post(`${base()}/${projectId}/regenerate-secret-key`);

/** POST /project/projects/:projectId/allowed-origins */
export const addAllowedOrigin = (projectId: string, data: { origin: string }) =>
  axios.post(`${base()}/${projectId}/allowed-origins`, data);

/** PATCH /project/projects/:projectId/settings */
export const updateProjectSettings = (
  projectId: string,
  data: {
    saveSubmissions?: boolean;
    enableAutoReply?: boolean;
    enableWebhook?: boolean;
    requireCaptcha?: boolean;
    rateLimitPerMinute?: number;
    maxAttachmentSizeMB?: number;
  },
) => axios.patch(`${base()}/${projectId}/settings`, data);
