import axios from "./axiosInstance";

type TemplateCategory =
  | "CONTACT"
  | "AUTO_REPLY"
  | "SUPPORT"
  | "BOOKING"
  | "CUSTOM";
type TemplateStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

type VariableType = "TEXT" | "EMAIL" | "TEXTAREA" | "NUMBER" | "SELECT" | "FILE";

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

const base = (projectId: string, serviceId: string) =>
  `/template/projects/${projectId}/services/${serviceId}/templates`;

/** POST /template/projects/:projectId/services/:serviceId/templates */
export const createTemplate = (
  projectId: string,
  serviceId: string,
  data: { name: string; description?: string; category?: TemplateCategory },
) => axios.post(base(projectId, serviceId), data);

/** GET /template/projects/:projectId/services/:serviceId/templates */
export const getProjectTemplates = (projectId: string, serviceId: string) =>
  axios.get(base(projectId, serviceId));

/** GET /template/projects/:projectId/services/:serviceId/templates/:templateId */
export const getTemplate = (
  projectId: string,
  serviceId: string,
  templateId: string,
) => axios.get(`${base(projectId, serviceId)}/${templateId}`);

/** PATCH /template/projects/:projectId/services/:serviceId/templates/:templateId/status */
export const updateTemplateStatus = (
  projectId: string,
  serviceId: string,
  templateId: string,
  data: { status: TemplateStatus },
) => axios.patch(`${base(projectId, serviceId)}/${templateId}/status`, data);

/** POST /template/projects/:projectId/services/:serviceId/templates/:templateId/config */
export const configTemplate = (
  projectId: string,
  serviceId: string,
  templateId: string,
    data: {
    subjectTemplate?: string;
    htmlTemplate?: string;
    textTemplate?: string;
    variables?: TemplateVariable[];
  },
) => axios.post(`${base(projectId, serviceId)}/${templateId}/config`, data);

/** PATCH /template/projects/:projectId/services/:serviceId/templates/:templateId/config */
export const updateTemplateConfig = (
  projectId: string,
  serviceId: string,
  templateId: string,
    data: {
    subjectTemplate?: string;
    htmlTemplate?: string;
    textTemplate?: string;
    variables?: TemplateVariable[];
  },
) => axios.patch(`${base(projectId, serviceId)}/${templateId}/config`, data);

/** POST /template/projects/:projectId/services/:serviceId/templates/:templateId/clone */
export const cloneTemplate = (
  projectId: string,
  serviceId: string,
  templateId: string,
  data: { name: string; description?: string; category?: TemplateCategory },
) => axios.post(`${base(projectId, serviceId)}/${templateId}/clone`, data);

/** POST /template/projects/:projectId/services/:serviceId/templates/:templateId/delivery-config */
export const setDeliveryConfig = (
  projectId: string,
  serviceId: string,
  templateId: string,
  data: { to?: string[]; cc?: string[]; bcc?: string[] },
) =>
  axios.post(
    `${base(projectId, serviceId)}/${templateId}/delivery-config`,
    data,
  );

/** PATCH /template/projects/:projectId/services/:serviceId/templates/:templateId/delivery-config */
export const updateDeliveryConfig = (
  projectId: string,
  serviceId: string,
  templateId: string,
  data: { to?: string[]; cc?: string[]; bcc?: string[] },
) =>
  axios.patch(
    `${base(projectId, serviceId)}/${templateId}/delivery-config`,
    data,
  );

/** PATCH /template/projects/:projectId/services/:serviceId/templates/:templateId/auto-reply-status */
export const toggleAutoReplyStatus = (
  projectId: string,
  serviceId: string,
  templateId: string,
) =>
  axios.patch(`${base(projectId, serviceId)}/${templateId}/auto-reply-status`);
