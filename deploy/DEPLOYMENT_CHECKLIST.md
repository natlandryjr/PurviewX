# PurviewX Deployment & Evidence Checklist

Use this checklist to ensure all deployment steps are completed correctly and to gather evidence for your compliance records.

## Phase 1: Azure Infrastructure Setup

- [ ] **Resource Group Created**
  - Name: `_________________________`
- [ ] **Azure Container Registry (ACR) Created & PurviewX Image Pushed**
  - Registry Name: `_________________________`
  - Image Tag: `_________________________`
- [ ] **Azure Database for PostgreSQL Created**
  - Server Name: `_________________________`
- [ ] **Azure App Service (Linux) Deployed**
  - App Name: `_________________________`
  - URL: `_________________________`
- [ ] **(Optional but Recommended) Azure Key Vault Created**
  - Vault Name: `_________________________`

---

## Phase 2: Microsoft Entra App Registration

- [ ] **Navigate to Microsoft Entra ID -> App registrations.**
- [ ] **New App Registration Created.**
  - Name: `PurviewX Application`
  - Supported account types: `This organization only`
- [ ] **`Application (client) ID` Recorded.**
  - Client ID: `_________________________`
- [ ] **`Directory (tenant) ID` Recorded.**
  - Tenant ID: `_________________________`
- [ ] **`[ SCREENSHOT ]`** - Take a screenshot of the **Overview** page of the App Registration.
  - _Reference: `images/app-reg-overview.png`_

- [ ] **Redirect URI Configured.**
  - Go to **Authentication** blade.
  - Type: `Single-page application (SPA)`
  - URI: `[Your App Service URL]`
- [ ] **`[ SCREENSHOT ]`** - Take a screenshot of the **Authentication** page showing the configured Redirect URI.
  - _Reference: `images/app-reg-auth.png`_

- [ ] **Client Secret Created and Recorded.**
  - Go to **Certificates & secrets**.
  - Secret Value: `[Stored securely, preferably in Key Vault]`
- [ ] **API Permissions Added.**
  - Go to **API permissions**.
  - Add all required **Microsoft Graph** delegated permissions as per the main `README.md`.
- [ ] **Admin Consent Granted.**
  - Click the **"Grant admin consent for..."** button.
- [ ] **`[ SCREENSHOT ]`** - Take a screenshot of the **API permissions** page showing that all permissions have been granted.
  - _Reference: `images/app-reg-perms.png`_

---

## Phase 3: Application Configuration

- [ ] **Navigate to the Azure App Service resource.**
- [ ] **Go to the `Configuration` blade.**
- [ ] **All required Application Settings / Environment Variables are set:**
  - `DATABASE_URL` (or Key Vault reference)
  - `PURVIEWX_CLOUD` (e.g., `Commercial`, `GCC High`)
  - `ENTRA_CLIENT_ID`
  - `ENTRA_TENANT_ID`
  - `ENTRA_CLIENT_SECRET` (or Key Vault reference)
- [ ] **`[ SCREENSHOT ]`** - Take a screenshot of the **Application settings** in the Configuration blade, ensuring secret values are hidden.
  - _Reference: `images/app-service-config.png`_

- [ ] **App Service Restarted.**
- [ ] **Navigate to App Service URL and verify the PurviewX wizard loads successfully.**

---
**Deployment Complete**
---
