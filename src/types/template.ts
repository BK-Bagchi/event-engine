import type { Project } from "./project";
import type { Service } from "./service";

export interface Template {
  id: string;
  userId: string;
  project: Project;
  projectId: string;
  service: Service;
  serviceId: string;
  name: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
