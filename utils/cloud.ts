import { CloudEnvironment } from '../types';

// Endpoint mapping for different Microsoft clouds
const CLOUD_URLS = {
  [CloudEnvironment.COMMERCIAL]: {
    auth: {
      authority: 'https://login.microsoftonline.com',
      tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    },
    graph: 'https://graph.microsoft.com',
    ipps: null, // Not specified for Commercial
  },
  [CloudEnvironment.GCC]: {
    auth: {
      authority: 'https://login.microsoftonline.us',
      tokenEndpoint: 'https://login.microsoftonline.us/common/oauth2/v2.0/token',
    },
    graph: 'https://graph.microsoft.us',
    ipps: null, // Not specified for GCC
  },
  [CloudEnvironment.GCC_HIGH]: {
    auth: {
      authority: 'https://login.microsoftonline.us',
      tokenEndpoint: 'https://login.microsoftonline.us/common/oauth2/v2.0/token',
    },
    graph: 'https://graph.microsoft.us',
    ipps: 'https://ps.compliance.protection.office365.us/powershell-liveid/',
  },
  [CloudEnvironment.DOD]: {
    auth: {
      authority: 'https://login.microsoftonline.us',
      tokenEndpoint: 'https://login.microsoftonline.us/common/oauth2/v2.0/token',
    },
    graph: 'https://graph.microsoft.us',
    ipps: 'https://l5.ps.compliance.protection.office365.us/powershell-liveid/',
  },
};

/**
 * Returns the authentication endpoints for a given cloud environment.
 * @param cloud The cloud environment.
 * @returns An object with authority and tokenEndpoint URLs.
 */
export const getAuthEndpoints = (cloud: CloudEnvironment) => {
  return CLOUD_URLS[cloud].auth;
};

/**
 * Returns the base URL for Microsoft Graph for a given cloud environment.
 * @param cloud The cloud environment.
 * @returns The Graph API base URL string.
 */
export const getGraphBaseUrl = (cloud: CloudEnvironment) => {
  return CLOUD_URLS[cloud].graph;
};

/**
 * Returns the IPPS URI for Compliance PowerShell for a given cloud environment.
 * @param cloud The cloud environment.
 * @returns The IPPS URI string, or null if not applicable.
 */
export const getIPPSUri = (cloud: CloudEnvironment) => {
  return CLOUD_URLS[cloud].ipps;
};

/**
 * Validates the PURVIEWX_CLOUD environment variable.
 * In a real Node.js environment, this would read from process.env.
 * For the frontend, we'll simulate this with a function that takes the value.
 * @param cloudValue The value from the environment variable.
 * @returns The validated CloudEnvironment enum member.
 * @throws An error if the value is invalid.
 */
export const getCloudFromEnvironment = (cloudValue: string | undefined): CloudEnvironment => {
  if (!cloudValue) {
    throw new Error('PURVIEWX_CLOUD environment variable is not set.');
  }

  const validClouds = Object.values(CloudEnvironment);
  if (validClouds.includes(cloudValue as CloudEnvironment)) {
    return cloudValue as CloudEnvironment;
  }

  throw new Error(`Invalid PURVIEWX_CLOUD value: "${cloudValue}". Must be one of [${validClouds.join(', ')}].`);
};

// Centralizing cloud-related constants here.
export const CLOUD_ENVIRONMENTS: CloudEnvironment[] = [
  CloudEnvironment.COMMERCIAL,
  CloudEnvironment.GCC,
  CloudEnvironment.GCC_HIGH,
  CloudEnvironment.DOD,
];
