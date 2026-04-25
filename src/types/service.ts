import type { Project } from "./project";

export interface Service {
  _id: string;
  id: string;
  userId: string;
  projectId: string;
  name: string;
  providerType: string;
  status: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
export type ServiceWithProject = Omit<Service, "projectId"> & {
  project: Project;
};
