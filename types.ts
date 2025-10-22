export enum CloudEnvironment {
  COMMERCIAL = 'Commercial',
  GCC = 'GCC',
  GCC_HIGH = 'GCC High',
  DOD = 'DoD',
}

export interface SensitivityLabel {
  id: string;
  name: string;
  description: string;
  color: string;
  priority: number;
  isEnabled: boolean;
}

export interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  durationDays: number; // -1 for indefinite
  isEnabled: boolean;
}

export interface DlpPolicy {
  id: string;
  name: string;
  description: string;
  locations: string[];
  isEnabled: boolean;
}

export interface CustomSit {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  confidence: number;
  xmlContent: string;
}

export interface WizardData {
  planType: 'baseline' | 'enhanced';
  cloudEnvironment: CloudEnvironment;
  consents: Record<string, boolean>;
  customSits: CustomSit[];
  sensitivityLabels: SensitivityLabel[];
  retentionPolicies: RetentionPolicy[];
  dlpPolicies: DlpPolicy[];
  auditSettings: {
    isEnabled: boolean;
    retentionDays: number;
  };
  eDiscoveryCase: {
    create: boolean;
    name: string;
  };
}

export interface FeatureScope {
  title: string;
  description: string;
  scopes: string[];
}

// For SRM Dashboard
export type SrmStatus = 'Compliant' | 'Non-compliant' | 'In Progress' | 'Not Assessed';

export interface SrmEvidence {
  id: string;
  name: string;
  type: 'Configuration' | 'Policy' | 'Report';
  details: string;
}

export interface SrmControl {
  id: string;
  controlName: string;
  description: string;
  status: SrmStatus;
  score: number;
  maxScore: number;
  evidence: SrmEvidence[];
}

// For Evidence Binder
export interface EvidenceBinder {
  version: number;
  timestamp: string;
  checksum: string;
  data: WizardData;
}
