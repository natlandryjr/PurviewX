import type { WizardData, FeatureScope, DlpPolicy, RetentionPolicy, SensitivityLabel } from './types';
import { CloudEnvironment } from './types';

export const WIZARD_STEPS = [
  'Plan',
  'Cloud Environment',
  'Consent',
  'Custom SITs',
  'Sensitivity Labels',
  'Retention',
  'DLP',
  'eDiscovery & Audit',
  'Review',
];

export const INITIAL_SENSITIVITY_LABELS: SensitivityLabel[] = [
  { id: 'sl1', name: 'Public', description: 'Data is public and can be shared freely.', color: '#9CA3AF', priority: 0, isEnabled: true },
  { id: 'sl2', name: 'General', description: 'General business data, not sensitive.', color: '#3B82F6', priority: 1, isEnabled: true },
  { id: 'sl3', name: 'Confidential', description: 'Sensitive business data, limited internal access.', color: '#F59E0B', priority: 2, isEnabled: true },
  { id: 'sl4', name: 'Highly Confidential', description: 'Very sensitive data, restricted to named users.', color: '#EF4444', priority: 3, isEnabled: true },
];

export const INITIAL_RETENTION_POLICIES: RetentionPolicy[] = [
    { id: 'rp1', name: 'Retain Financial Records for 7 Years', description: 'Applies to financial documents in SharePoint and OneDrive.', durationDays: 2555, isEnabled: true },
    { id: 'rp2', name: 'Retain Project Documents for 5 Years', description: 'Keeps project-related materials for 5 years after last modification.', durationDays: 1825, isEnabled: false },
    { id: 'rp3', name: 'Delete Teams Chat History after 90 Days', description: 'Reduces data sprawl by cleaning up old chat messages.', durationDays: 90, isEnabled: false },
];

export const INITIAL_DLP_POLICIES: DlpPolicy[] = [
    { id: 'dlp1', name: 'U.S. Financial Data Protection', description: 'Detects and blocks sharing of credit card numbers and bank account info.', locations: ['Exchange', 'SharePoint', 'OneDrive', 'Teams'], isEnabled: true },
    { id: 'dlp2', name: 'Health Information (HIPAA)', description: 'Prevents sharing of protected health information (PHI) outside the organization.', locations: ['Exchange', 'Teams'], isEnabled: false },
    { id: 'dlp3', name: 'Block Executable Files on Endpoints', description: 'Prevents users from downloading or transferring executable files.', locations: ['Devices'], isEnabled: false },
];

export const INITIAL_WIZARD_DATA: WizardData = {
  planType: 'baseline',
  cloudEnvironment: CloudEnvironment.COMMERCIAL,
  consents: {},
  customSits: [],
  sensitivityLabels: INITIAL_SENSITIVITY_LABELS,
  retentionPolicies: INITIAL_RETENTION_POLICIES,
  dlpPolicies: INITIAL_DLP_POLICIES,
  auditSettings: {
    isEnabled: true,
    retentionDays: 365,
  },
  eDiscoveryCase: {
    create: true,
    name: 'Initial Investigation Case 2024',
  }
};

export const FEATURE_SCOPES: Record<string, FeatureScope> = {
  graph: {
    title: 'Microsoft Graph API',
    description: 'Provides core access to organizational data like users and groups.',
    scopes: ['User.Read.All', 'Group.Read.All', 'Directory.Read.All'],
  },
  security: {
    title: 'Security & Compliance',
    description: 'Allows reading and writing security policies, including DLP and sensitivity labels.',
    scopes: ['SecurityEvents.ReadWrite.All', 'Policy.Read.All', 'InformationProtectionPolicy.ReadWrite'],
  },
  ediscovery: {
    title: 'eDiscovery',
    description: 'Enables creation and management of eDiscovery cases and holds.',
    scopes: ['eDiscovery.ReadWrite.All'],
  },
  powershell: {
    title: 'Exchange Online PowerShell',
    description: 'Required for advanced configuration tasks and automation scripts.',
    scopes: ['Exchange.ManageAsApp'],
  },
};
