# PurviewX Deployment Guide for Microsoft Azure

This guide provides instructions for deploying the PurviewX application to a customer's Azure tenant. It covers deployment to Azure App Service (recommended) or Azure Container Apps, security considerations, and the required Microsoft Entra ID (formerly Azure AD) App Registration.

## Table of Contents
1.  [Prerequisites](#prerequisites)
2.  [Deployment Options](#deployment-options)
    *   [Option A: Azure App Service (Linux)](#option-a-azure-app-service-linux)
    *   [Option B: Azure Container Apps](#option-b-azure-container-apps)
3.  [Security Hardening](#security-hardening)
    *   [Virtual Network (VNet) Integration](#virtual-network-vnet-integration)
    *   [Using Azure Key Vault for Secrets](#using-azure-key-vault-for-secrets)
4.  [Microsoft Entra App Registration](#microsoft-entra-app-registration)
5.  [Final Configuration](#final-configuration)

---

## Prerequisites

*   An Azure Subscription with permissions to create resources (App Service, Container Apps, Key Vault, etc.).
*   A Microsoft Entra ID tenant where you have permissions to create and consent to App Registrations (e.g., Application Administrator or Global Administrator).
*   The PurviewX Docker image pushed to a container registry (e.g., Azure Container Registry).
*   A provisioned PostgreSQL database (e.g., Azure Database for PostgreSQL).

---

## Deployment Options

### Option A: Azure App Service (Linux)

This is the recommended approach for its simplicity and robust feature set.

1.  **Create an App Service Plan:**
    *   Choose a Linux-based App Service Plan with a suitable pricing tier.

2.  **Create a Web App:**
    *   In the Azure Portal, create a new "Web App".
    *   **Basics Tab:**
        *   Select your subscription and resource group.
        *   Give it a unique name (e.g., `purviewx-app`).
        *   Publish: `Docker Container`
        *   Operating System: `Linux`
        *   Select the App Service Plan you created.
    *   **Docker Tab:**
        *   Image Source: `Azure Container Registry` (or your chosen registry).
        *   Select the PurviewX image and tag.

3.  **Configure the App Service:**
    *   Navigate to your newly created App Service.
    *   Go to the **Configuration** blade.
    *   **Application settings:** Add the following settings:
        *   `DATABASE_URL`: Your PostgreSQL connection string.
        *   `PURVIEWX_CLOUD`: The target cloud environment. Must be one of `Commercial`, `GCC`, `GCC High`, or `DOD`.
        *   `ENTRA_CLIENT_ID`: The Client ID from the App Registration (see section below).
        *   `ENTRA_TENANT_ID`: Your Microsoft Entra Tenant ID.
        *   `ENTRA_CLIENT_SECRET`: A client secret generated in the App Registration. **(Recommended to store in Key Vault)**.
    *   **General settings:**
        *   Ensure "HTTPS Only" is set to `On`.

    _See screenshot for reference:_
    ![App Service Configuration](images/app-service-config.png)

### Option B: Azure Container Apps

This is a good option for microservices-oriented or serverless container environments.

1.  **Create a Container Apps Environment:** This provides an isolated boundary for your container apps.
2.  **Create a Container App:**
    *   Select your environment.
    *   Configure the container to use the PurviewX image from your registry.
    *   **Secrets:** Use the built-in secrets management to store your `DATABASE_URL` and `ENTRA_CLIENT_SECRET`.
    *   **Environment Variables:** Add `PURVIEWX_CLOUD`, `ENTRA_CLIENT_ID`, and `ENTRA_TENANT_ID`. Reference your stored secrets for the others.
    *   **Ingress:** Enable ingress and set the target port to `3000` to expose the web UI.

---

## Security Hardening

### Virtual Network (VNet) Integration

To ensure the application is not exposed to the public internet and can securely access resources like your database.

1.  **Enable VNet Integration:**
    *   In the App Service, go to the **Networking** blade.
    *   Under "Outbound Traffic", configure VNet integration to connect the app to a virtual network.
2.  **Configure Private Endpoints:**
    *   For your App Service and PostgreSQL database, create Private Endpoints within your VNet. This assigns them private IP addresses and ensures traffic does not traverse the public internet.

### Using Azure Key Vault for Secrets

It is a security best practice to store all secrets (database connection strings, client secrets) in Azure Key Vault.

1.  **Create an Azure Key Vault.**
2.  **Add Secrets:** Store your `DATABASE_URL` and `ENTRA_CLIENT_SECRET` as secrets in the vault.
3.  **Grant Access:**
    *   Enable a System-Assigned Managed Identity for your App Service.
    *   In the Key Vault, go to "Access policies" and create a new policy that grants the App Service's Managed Identity `Get` and `List` permissions for secrets.
4.  **Reference Secrets in App Service:**
    *   In the App Service configuration, instead of entering the secret values directly, use Key Vault references:
        *   Example syntax: `@Microsoft.KeyVault(SecretUri=https://<your-vault-name>.vault.azure.net/secrets/<your-secret-name>/<secret-version>)`

---

## Microsoft Entra App Registration

This is the most critical step to allow PurviewX to authenticate and interact with your Microsoft 365 tenant.

1.  **Navigate to Microsoft Entra ID -> App registrations** in your Azure portal.
2.  Click **New registration**.
3.  **Name:** `PurviewX Application` (or similar).
4.  **Supported account types:** Select `Accounts in this organizational directory only (<Your Tenant Name> only)`.
5.  **Redirect URI (Single-page application - SPA):**
    *   Add the primary URL of your deployed App Service.
    *   Example: `https://purviewx-app.azurewebsites.net`
6.  Click **Register**.

    _See screenshot for reference:_
    ![App Registration Overview](images/app-reg-overview.png)

7.  **Note the `Application (client) ID` and `Directory (tenant) ID`**. You will need these for your App Service configuration.

8.  **Create a Client Secret:**
    *   Go to **Certificates & secrets**.
    *   Click **New client secret**.
    *   Give it a description and an expiry duration.
    *   **IMPORTANT:** Copy the secret **Value** immediately. It will not be shown again. This is your `ENTRA_CLIENT_SECRET`.

9.  **Configure API Permissions (Admin Consent):**
    *   Go to **API permissions**.
    *   Click **Add a permission**.
    *   Select **Microsoft Graph**.
    *   Select **Delegated permissions**.
    *   Add the following permissions based on the features you will use:
        *   `Application.Read.All`
        *   `Directory.Read.All`
        *   `Policy.Read.All`
        *   `InformationProtectionPolicy.ReadWrite`
        *   `DataLossPreventionPolicy.ReadWrite`
        *   `RecordsManagement.ReadWrite.All`
        *   `eDiscovery.ReadWrite.All`
        *   `Audit.ReadWrite.All`
    *   After adding the permissions, click the **Grant admin consent for <Your Tenant Name>** button. The status for all permissions should change to "Granted".

    _See screenshot for reference:_
    ![API Permissions](images/app-reg-perms.png)

---

## Final Configuration

Once the App Service is deployed and the App Registration is complete:

1.  Populate all the required Application Settings in your App Service as described above.
2.  Restart the App Service.
3.  Navigate to the App Service URL to begin the PurviewX setup wizard.
