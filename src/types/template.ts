import type { Project } from "./project";
import type { Service } from "./service";

export type TemplateStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
export type TemplateCategory =
  | "CONTACT"
  | "AUTO_REPLY"
  | "SUPPORT"
  | "BOOKING"
  | "CUSTOM";
export type VariableType =
  | "TEXT"
  | "EMAIL"
  | "TEXTAREA"
  | "NUMBER"
  | "SELECT"
  | "FILE";

export interface TemplateVariable {
  type: VariableType;
  key: string;
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    regex?: string;
    allowedValues?: string[];
  };
}

export interface DeliveryConfig {
  to: string[];
  cc: string[];
  bcc: string[];
  replyToField?: string;
}

export interface AutoReplyConfig {
  enabled: boolean;
}

export interface WebhookConfig {
  enabled: boolean;
  webhookId?: string;
}

export interface Template {
  id: string;
  userId: string;
  project: Project;
  projectId: string;
  service?: Service;
  serviceId?: string;
  name: string;
  templateKey?: string;
  description?: string;
  category: TemplateCategory;
  status: TemplateStatus;
  subjectTemplate?: string;
  htmlTemplate?: string;
  textTemplate?: string;
  variables: TemplateVariable[];
  deliveryConfig: DeliveryConfig;
  autoReplyConfig: AutoReplyConfig;
  saveSubmission: boolean;
  webhookConfig: WebhookConfig;
  createdAt: string;
  updatedAt: string;
}
