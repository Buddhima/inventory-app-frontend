# Inventory & Job Management Frontend Application

## 📌 Overview
This is the frontend application for the Inventory & Job Template Management system. It provides a user-friendly interface for managing inventory, creating jobs from templates, and interacting with **WorkflowMax**. The application is built using **React** and **Ionic**, and communicates with the backend via REST APIs.

---

## ✨ Features

### Job Management
- Create jobs using predefined job templates
- View previously created jobs
- Add additional job cost items that are **not included in the template**
- Automatically limit job cost quantities based on available inventory stock

### Inventory Management
- View current stock inventory levels
- Upload bulk inventory via file upload
- Add and manage individual inventory items
- Track inventory availability when creating jobs

### Job Templates
- Retrieve and use job templates for standardized job creation
- Update template-related details required for WorkflowMax jobs

### Security & Access Control
- Only **authenticated users** can access the application
- Authentication is handled through the backend using AWS Cognito

---

## 🛠 Technology Stack
- React
- Ionic Framework
- TypeScript
- REST API integration with the backend services

---

## 🏗 Application Architecture
- Built as a **React + Ionic** single-page application
- Communicates with backend APIs exposed via AWS API Gateway
- Uses secure API calls for inventory, job templates, and job management
- Designed for responsive use across desktop and mobile devices

---

## ⚙️ Configuration
- Local development uses a `.env` file at the repository root. This file contains dev values and is ignored by Git.
- Use `.env.example` as the template for required environment variables.
- GitHub deployments use GitHub Environments named `dev` and `prod`; each environment supplies its own AWS and frontend variables.
- Cognito callback and logout URLs must match the values configured in the backend Cognito app client for the same AWS account/environment.

### Required frontend variables
```bash
REACT_APP_API_BASE_URL=https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/<STAGE_NAME>
REACT_APP_AWS_REGION=<AWS_REGION>
REACT_APP_COGNITO_USER_POOL_ID=<COGNITO_USER_POOL_ID>
REACT_APP_COGNITO_USER_POOL_CLIENT_ID=<COGNITO_USER_POOL_CLIENT_ID>
REACT_APP_COGNITO_DOMAIN=inventory-app-<STAGE_NAME>-auth.auth.<AWS_REGION>.amazoncognito.com
REACT_APP_REDIRECT_SIGN_IN=http://localhost:8100/auth/callback
REACT_APP_REDIRECT_SIGN_OUT=http://localhost:8100/
```

For deployed environments, set `REACT_APP_REDIRECT_SIGN_IN` and `REACT_APP_REDIRECT_SIGN_OUT` to the deployed frontend URLs registered with Cognito, for example:

```bash
REACT_APP_REDIRECT_SIGN_IN=https://<frontend-domain>/auth/callback
REACT_APP_REDIRECT_SIGN_OUT=https://<frontend-domain>/
```

### GitHub deployment variables
Create GitHub Environments named `dev` and `prod`. Add these environment variables to both:

```bash
AWS_REGION=<AWS_REGION>
S3_BUCKET=<FRONTEND_BUCKET_NAME>
REACT_APP_API_BASE_URL=https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/<STAGE_NAME>
REACT_APP_AWS_REGION=<AWS_REGION>
REACT_APP_COGNITO_USER_POOL_ID=<COGNITO_USER_POOL_ID>
REACT_APP_COGNITO_USER_POOL_CLIENT_ID=<COGNITO_USER_POOL_CLIENT_ID>
REACT_APP_COGNITO_DOMAIN=inventory-app-<STAGE_NAME>-auth.auth.<AWS_REGION>.amazoncognito.com
REACT_APP_REDIRECT_SIGN_IN=https://<frontend-domain>/auth/callback
REACT_APP_REDIRECT_SIGN_OUT=https://<frontend-domain>/
```

Add this environment secret to both:

```bash
AWS_ROLE_ARN=<GITHUB_ACTIONS_DEPLOY_ROLE_ARN>
```

The deploy workflow runs `dev` first, then `prod`. Protect the `prod` GitHub Environment with a required approval if production deployments should be gated.

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js
- Ionic CLI

### Configure dev environment
The local `.env` file should contain dev stack values. It is ignored by Git and should not be committed.

### Install Dependencies
```bash
npm install
```

### Start the development server
```bash
ionic serve
```
