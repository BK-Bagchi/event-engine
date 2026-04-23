export interface Settings {
  saveSubmissions: boolean;
  enableAutoReply: boolean;
  enableWebhook: boolean;
  requireCaptcha: boolean;
  rateLimitPerMinute: number;
  maxAttachmentSizeMB: number;
}

export interface UsageStats {
  totalRequests: number;
  totalSent: number;
  totalFailed: number;
  totalBlocked: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  publicKey: string;
  secretKey: string;
  allowedOrigins: string[];
  settings: Settings;
  usageStats: UsageStats;
  createdAt: string;
  updatedAt: string;
}
