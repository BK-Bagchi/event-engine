import axios from "./axiosInstance";

type ActionType =
  | "SEND_EMAIL"
  | "AUTO_REPLY"
  | "SAVE_SUBMISSION"
  | "TRIGGER_WEBHOOK"
  | "LABEL_SUBMISSION";

const base = (projectId: string, templateId: string) =>
  `/workflow/projects/${projectId}/templates/${templateId}/workflows`;

/** POST /workflow/projects/:projectId/templates/:templateId/workflows */
export const createWorkflow = (projectId: string, templateId: string) =>
  axios.post(base(projectId, templateId));

/** GET /workflow/projects/:projectId/workflows */
export const getProjectWorkflows = (projectId: string) =>
  axios.get(`/workflow/projects/${projectId}/workflows`);

/** GET /workflow/projects/:projectId/templates/:templateId/workflows */
export const getTemplateWorkflows = (projectId: string, templateId: string) =>
  axios.get(base(projectId, templateId));

/** GET /workflow/projects/:projectId/templates/:templateId/workflows/:workflowId */
export const getWorkflow = (
  projectId: string,
  templateId: string,
  workflowId: string,
) => axios.get(`${base(projectId, templateId)}/${workflowId}`);

/** PATCH /workflow/projects/:projectId/templates/:templateId/workflows/:workflowId/actions */
export const updateWorkflowActions = (
  projectId: string,
  templateId: string,
  workflowId: string,
  data: { actions: { type: ActionType; enabled: boolean }[] },
) => axios.patch(`${base(projectId, templateId)}/${workflowId}/actions`, data);

/** PATCH /workflow/projects/:projectId/templates/:templateId/workflows/:workflowId/status */
export const updateWorkflowStatus = (
  projectId: string,
  templateId: string,
  workflowId: string,
  data: { status: string },
) => axios.patch(`${base(projectId, templateId)}/${workflowId}/status`, data);
