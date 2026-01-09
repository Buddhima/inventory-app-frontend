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
- The frontend must be configured to point to the correct backend API endpoints
- Ensure authentication and WorkflowMax-related configurations are properly set in the backend
- API URLs and environment-specific values should be updated as needed

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js
- Ionic CLI

### Install Dependencies
```bash
npm install
```

### Start the development server
```bash
ionic serve
```