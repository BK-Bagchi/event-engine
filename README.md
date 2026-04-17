# Event Engine

> An API-based backend platform that allows developers to send emails directly from frontend applications without building their own backend.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)

## 🎯 Project Overview

**Event Engine** is a backend-as-a-service that converts frontend form submissions into automated email workflows without requiring developers to build their own backend.

### Core Purpose

To eliminate the need for a custom backend just for handling:

- contact forms
- email sending
- basic automation

### Key Features

- Send emails from frontend apps via API
- Template-based email system
- Secure backend relay (no exposed credentials)
- Auto-reply to users
- Submission storage (like a mini CRM)
- Activity logs and email status tracking
- Webhook support for integrations
- Anti-spam protections (rate limit, captcha, origin control)

### What Makes It Better Than EmailJS

- Stores all submissions (not just sending emails)
- Supports multi-action workflows (email + save + webhook)
- Better tracking and analytics
- More flexible template and service control

### One-Line Summary

Event Engine is a backend-as-a-service that converts frontend form submissions into automated email workflows without requiring developers to build their own backend.

## 🔄 How It Works

### Simple Flow

1. **Create Project**: User creates a project in the dashboard to get API credentials
2. **Connect Email Service**: Link an email provider (Gmail, SMTP, Outlook, etc.) securely
3. **Build Templates**: Create email templates with dynamic variables (name, email, message, etc.)
4. **Send via API**: Frontend app sends form data to Event Engine's POST endpoint
5. **Process & Send**: Event Engine:
   - Validates the API request
   - Injects form data into the template
   - Sends email via configured service
   - Stores submission records and logs

### Architecture Flow

```
Frontend App
    ↓
Event Engine API
    ├─→ Validate Request
    ├─→ Load Template
    ├─→ Inject Variables
    ├─→ Send Email (via Email Service)
    ├─→ Store Submission
    └─→ Log Activity
```

## ✨ Features

- **Express.js HTTP Server** with TypeScript support
- **Automatic Server Restart** on file changes using nodemon
- **Hot Reload** during development for faster iteration
- **Environment-based Configuration** for flexible deployment
- **Type Safety** with strict TypeScript checking
- **MongoDB Integration** for data persistence
- **Redis Caching** for improved performance
- **JWT Authentication** for secure API access
- **Email Service Integration** (nodemailer support)
- **Project & User Management**
- **Template Management** with structure customization
- **Workflow Automation**
- **Submission & Log Tracking**
- **Rate Limiting** and security features

## 🛠 Tech Stack

- **Runtime**: Node.js (v16+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (ioredis)
- **Authentication**: JWT
- **Email**: Nodemailer
- **Dev Tools**: Nodemon for auto-restart
- **Environment**: ESM modules with path aliases

## 📄 License

MIT
optionally triggers auto-reply or workflows
