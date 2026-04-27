import axios from "./axiosInstance";

type TemplateCategory =
  | "CONTACT"
  | "AUTO_REPLY"
  | "SUPPORT"
  | "BOOKING"
  | "CUSTOM";
type TemplateStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

type VariableType =
  | "TEXT"
  | "EMAIL"
  | "TEXTAREA"
  | "NUMBER"
  | "SELECT"
  | "FILE";

type TemplateVariableValidation = {
  minLength?: number;
  maxLength?: number;
  regex?: string;
  allowedValues?: string[];
};

type TemplateVariable = {
  type: VariableType;
  enum?: VariableType[]; // optional enum of allowed variable types
  key: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  validation?: TemplateVariableValidation;
};

const base = (projectId: string) => `/template/projects/${projectId}/templates`;

/** GET /template/templates */
export const getAllTemplates = () => axios.get(`/template/templates`);

/** POST /template/projects/:projectId/services/:serviceId/templates */
export const createTemplate = (
  projectId: string,
  serviceId: string,
  data: { name: string; description?: string; category?: TemplateCategory },
) =>
  axios.post(
    `/template/projects/${projectId}/services/${serviceId}/templates`,
    data,
  );

/** GET /template/projects/:projectId/templates */
export const getProjectTemplates = (projectId: string) =>
  axios.get(base(projectId));

/** GET /template/projects/:projectId/templates/:templateId */
export const getTemplate = (projectId: string, templateId: string) =>
  axios.get(`${base(projectId)}/${templateId}`);

/** PATCH /template/projects/:projectId/templates/:templateId/status */
export const updateTemplateStatus = (
  projectId: string,
  templateId: string,
  data: { status: TemplateStatus },
) => axios.patch(`${base(projectId)}/${templateId}/status`, data);

/** POST /template/projects/:projectId/templates/:templateId/config */
export const configTemplate = (
  projectId: string,
  templateId: string,
  data: {
    subjectTemplate?: string;
    htmlTemplate?: string;
    textTemplate?: string;
    variables?: TemplateVariable[];
  },
) => axios.post(`${base(projectId)}/${templateId}/config`, data);

/** PATCH /template/projects/:projectId/templates/:templateId/config */
export const updateTemplateConfig = (
  projectId: string,
  templateId: string,
  data: {
    subjectTemplate?: string;
    htmlTemplate?: string;
    textTemplate?: string;
    variables?: TemplateVariable[];
  },
) => axios.patch(`${base(projectId)}/${templateId}/config`, data);

/** POST /template/projects/:projectId/templates/:templateId/clone */
export const cloneTemplate = (
  projectId: string,
  templateId: string,
  data: { name: string; description?: string; category?: TemplateCategory },
) => axios.post(`${base(projectId)}/${templateId}/clone`, data);

/** POST /template/projects/:projectId/templates/:templateId/delivery-config */
export const setDeliveryConfig = (
  projectId: string,
  templateId: string,
  data: { to?: string[]; cc?: string[]; bcc?: string[] },
) => axios.post(`${base(projectId)}/${templateId}/delivery-config`, data);

/** PATCH /template/projects/:projectId/templates/:templateId/delivery-config */
export const updateDeliveryConfig = (
  projectId: string,
  templateId: string,
  data: { to?: string[]; cc?: string[]; bcc?: string[] },
) => axios.patch(`${base(projectId)}/${templateId}/delivery-config`, data);

/** PATCH /template/projects/:projectId/templates/:templateId/auto-reply-status */
export const toggleAutoReplyStatus = (projectId: string, templateId: string) =>
  axios.patch(`${base(projectId)}/${templateId}/auto-reply-status`);
