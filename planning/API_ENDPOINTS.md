# API Endpoints Documentation

## Base Configuration

- **Base URL**: `import.meta.env.VITE_API_URL ?? "http://localhost:4013/api"`
- **Full Endpoint Pattern**: `{BASE_URL}{moduleBase}{endpoint}`

Example: 
- Base URL: `http://localhost:4013/api`
- Module Base: `/auth`
- Endpoint: `/register`
- **Full URL**: `http://localhost:4013/api/auth/register`

---

## Authentication Endpoints (`/auth`)

### POST `/auth/register`
Register a new user account.

**Request Body:**
```typescript
{
  fullName: string;
  email: string;
  passwordHash: string;
}
```

### POST `/auth/login`
Login with email and password.

**Request Body:**
```typescript
{
  email: string;
  passwordHash: string;
}
```

### POST `/auth/oauth-login`
Login using OAuth token.

**Request Body:**
```typescript
{
  token: string;
}
```

### POST `/auth/send-password-reset-otp`
Request password reset OTP.

**Request Body:**
```typescript
{
  email: string;
}
```

### POST `/auth/verify-password-reset-otp`
Verify the password reset OTP.

**Request Body:**
```typescript
{
  userId: string;
  otp: string;
}
```

### POST `/auth/reset-password`
Reset password using verified OTP.

**Request Body:**
```typescript
{
  userId: string;
  otpId: string;
  newPassword: string;
}
```

### POST `/auth/change-password`
⚠️ **Requires Auth Token**

Change password for authenticated user.

**Request Body:**
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

### POST `/auth/logout`
⚠️ **Requires Auth Token**

Logout and invalidate current session.

---

## User Endpoints (`/user`)

### GET `/user/profile`
⚠️ **Requires Auth Token**

Retrieve user profile information.

### PATCH `/user/profile`
⚠️ **Requires Auth Token**

Update user profile information.

**Request Body:**
```typescript
{
  fullName?: string;
  timezone?: string;
  avatar?: string;
}
```

### POST `/user/email-verification-otp`
⚠️ **Requires Auth Token**

Send email verification OTP.

### POST `/user/verify-email`
⚠️ **Requires Auth Token**

Verify email with OTP.

**Request Body:**
```typescript
{
  otp: string;
}
```

---

## Project Endpoints (`/project/projects`)

### POST `/project/projects`
⚠️ **Requires Auth Token**

Create a new project.

**Request Body:**
```typescript
{
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
}
```

### GET `/project/projects`
⚠️ **Requires Auth Token**

Retrieve all projects.

### GET `/project/projects/:projectId`
⚠️ **Requires Auth Token**

Retrieve a specific project by ID.

**URL Parameters:**
- `projectId` (string): The project ID

### PATCH `/project/projects/:projectId/info`
⚠️ **Requires Auth Token**

Update project information.

**URL Parameters:**
- `projectId` (string): The project ID

**Request Body:**
```typescript
{
  name?: string;
  description?: string;
}
```

### PATCH `/project/projects/:projectId/status`
⚠️ **Requires Auth Token**

Update project status.

**URL Parameters:**
- `projectId` (string): The project ID

**Request Body:**
```typescript
{
  status: "ACTIVE" | "ARCHIVED";
}
```

### POST `/project/projects/:projectId/regenerate-public-key`
⚠️ **Requires Auth Token**

Regenerate project public key.

**URL Parameters:**
- `projectId` (string): The project ID

### POST `/project/projects/:projectId/regenerate-secret-key`
⚠️ **Requires Auth Token**

Regenerate project secret key.

**URL Parameters:**
- `projectId` (string): The project ID

### POST `/project/projects/:projectId/allowed-origins`
⚠️ **Requires Auth Token**

Add allowed origin to project.

**URL Parameters:**
- `projectId` (string): The project ID

**Request Body:**
```typescript
{
  origin: string;
}
```

### PATCH `/project/projects/:projectId/settings`
⚠️ **Requires Auth Token**

Update project settings.

**URL Parameters:**
- `projectId` (string): The project ID

**Request Body:**
```typescript
{
  saveSubmissions?: boolean;
  enableAutoReply?: boolean;
  enableWebhook?: boolean;
  requireCaptcha?: boolean;
  rateLimitPerMinute?: number;
  maxAttachmentSizeMB?: number;
}
```

---

## Service Endpoints (`/service/projects/:projectId/services`)

### POST `/service/projects/:projectId/services`
⚠️ **Requires Auth Token**

Create a new service.

**URL Parameters:**
- `projectId` (string): The project ID

**Request Body:**
```typescript
{
  name: string;
  providerType: "GMAIL" | "OUTLOOK" | "SMTP" | "RESEND" | "SENDGRID";
  isDefault?: boolean;
}
```

### GET `/service/projects/:projectId/services`
⚠️ **Requires Auth Token**

Retrieve all services for a project.

**URL Parameters:**
- `projectId` (string): The project ID

### GET `/service/projects/:projectId/services/:serviceId`
⚠️ **Requires Auth Token**

Retrieve a specific service.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID

### PATCH `/service/projects/:projectId/services/:serviceId`
⚠️ **Requires Auth Token**

Update service information.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID

**Request Body:**
```typescript
{
  name?: string;
  providerType?: "GMAIL" | "OUTLOOK" | "SMTP" | "RESEND" | "SENDGRID";
  isDefault?: boolean;
}
```

### PATCH `/service/projects/:projectId/services/:serviceId/status`
⚠️ **Requires Auth Token**

Update service status.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID

**Request Body:**
```typescript
{
  status: string;
}
```

---

## Template Endpoints (`/template/projects/:projectId/services/:serviceId/templates`)

### POST `/template/projects/:projectId/services/:serviceId/templates`
⚠️ **Requires Auth Token**

Create a new template.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID

**Request Body:**
```typescript
{
  name: string;
  description?: string;
  category?: "CONTACT" | "AUTO_REPLY" | "SUPPORT" | "BOOKING" | "CUSTOM";
}
```

### GET `/template/projects/:projectId/services/:serviceId/templates`
⚠️ **Requires Auth Token**

Retrieve all templates for a service.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID

### GET `/template/projects/:projectId/services/:serviceId/templates/:templateId`
⚠️ **Requires Auth Token**

Retrieve a specific template.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID
- `templateId` (string): The template ID

### PATCH `/template/projects/:projectId/services/:serviceId/templates/:templateId/status`
⚠️ **Requires Auth Token**

Update template status.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID
- `templateId` (string): The template ID

**Request Body:**
```typescript
{
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
}
```

### POST `/template/projects/:projectId/services/:serviceId/templates/:templateId/config`
⚠️ **Requires Auth Token**

Configure template with subject, HTML, text, and variables.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID
- `templateId` (string): The template ID

**Request Body:**
```typescript
{
  subjectTemplate?: string;
  htmlTemplate?: string;
  textTemplate?: string;
  variables?: {
    type: "TEXT" | "EMAIL" | "TEXTAREA" | "NUMBER" | "SELECT" | "FILE";
    enum?: ("TEXT" | "EMAIL" | "TEXTAREA" | "NUMBER" | "SELECT" | "FILE")[];
    key: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
    defaultValue?: string;
    validation?: {
      minLength?: number;
      maxLength?: number;
      regex?: string;
      allowedValues?: string[];
    };
  }[];
}
```

### PATCH `/template/projects/:projectId/services/:serviceId/templates/:templateId/config`
⚠️ **Requires Auth Token**

Update template configuration.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID
- `templateId` (string): The template ID

**Request Body:**
```typescript
{
  subjectTemplate?: string;
  htmlTemplate?: string;
  textTemplate?: string;
  variables?: TemplateVariable[];
}
```

### POST `/template/projects/:projectId/services/:serviceId/templates/:templateId/clone`
⚠️ **Requires Auth Token**

Clone an existing template.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID
- `templateId` (string): The template ID

**Request Body:**
```typescript
{
  name: string;
  description?: string;
  category?: "CONTACT" | "AUTO_REPLY" | "SUPPORT" | "BOOKING" | "CUSTOM";
}
```

### POST `/template/projects/:projectId/services/:serviceId/templates/:templateId/delivery-config`
⚠️ **Requires Auth Token**

Set delivery configuration for template.

**URL Parameters:**
- `projectId` (string): The project ID
- `serviceId` (string): The service ID
- `templateId` (string): The template ID

**Request Body:**
```typescript
{
  to?: string[];
  cc?: string[];
  bcc?: string[];
}
```

---

## Workflow Endpoints (`/workflow/projects/:projectId/templates/:templateId/workflows`)

### POST `/workflow/projects/:projectId/templates/:templateId/workflows`
⚠️ **Requires Auth Token**

Create a new workflow.

**URL Parameters:**
- `projectId` (string): The project ID
- `templateId` (string): The template ID

**Request Body:**
```typescript
{
  actions: {
    type: "SEND_EMAIL" | "AUTO_REPLY" | "SAVE_SUBMISSION" | "TRIGGER_WEBHOOK" | "LABEL_SUBMISSION";
    enabled?: boolean;
  }[];
}
```

### GET `/workflow/projects/:projectId/workflows`
⚠️ **Requires Auth Token**

Retrieve all workflows for a project.

**URL Parameters:**
- `projectId` (string): The project ID

### GET `/workflow/projects/:projectId/templates/:templateId/workflows`
⚠️ **Requires Auth Token**

Retrieve all workflows for a template.

**URL Parameters:**
- `projectId` (string): The project ID
- `templateId` (string): The template ID

### GET `/workflow/projects/:projectId/templates/:templateId/workflows/:workflowId`
⚠️ **Requires Auth Token**

Retrieve a specific workflow.

**URL Parameters:**
- `projectId` (string): The project ID
- `templateId` (string): The template ID
- `workflowId` (string): The workflow ID

### PATCH `/workflow/projects/:projectId/templates/:templateId/workflows/:workflowId/status`
⚠️ **Requires Auth Token**

Update workflow status.

**URL Parameters:**
- `projectId` (string): The project ID
- `templateId` (string): The template ID
- `workflowId` (string): The workflow ID

**Request Body:**
```typescript
{
  status: string;
}
```

---

## Authentication Header

All endpoints marked with ⚠️ **Requires Auth Token** require the following header:

```
Authorization: EventEngine {token}
```

The token is automatically attached by the axios interceptor from `localStorage` when making requests.

---

## CORS & Credentials

- `withCredentials: true` - Cookies are included in requests
- `Content-Type: application/json` - All requests use JSON format
