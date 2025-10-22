import type { WizardData } from '../types';

export interface PlanStep {
  id: string;
  title: string;
  details: string;
  duration: number; // in ms
  execute: (data: WizardData) => Promise<{ success: boolean; message: string }>;
}

const simulateApiCall = (message: string, duration = 1000): Promise<{ success: boolean; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[Plan Runner] Executed: ${message}`);
      resolve({ success: true, message: `${message}: Success` });
    }, duration);
  });
};

export const generatePlan = (data: WizardData): PlanStep[] => {
  const plan: PlanStep[] = [];

  plan.push({
    id: 'connect-api',
    title: 'Initialize API Connections',
    details: `Connecting to ${data.cloudEnvironment} endpoints.`,
    duration: 1200,
    execute: () => simulateApiCall('Initialized API Connections', 1200),
  });
  
  if (data.customSits.length > 0) {
      plan.push({
        id: 'import-sits',
        title: `Import ${data.customSits.length} Custom SITs`,
        details: 'Uploading XML definitions for custom sensitive info types.',
        duration: 1500 + data.customSits.length * 200,
        execute: () => simulateApiCall(`Imported ${data.customSits.length} SITs`, 1500 + data.customSits.length * 200),
      });
  }

  plan.push({
    id: 'configure-labels',
    title: `Configure ${data.sensitivityLabels.length} Sensitivity Labels`,
    details: 'Creating and ordering sensitivity labels.',
    duration: 2000,
    execute: () => simulateApiCall('Configured Sensitivity Labels', 2000),
  });

  const enabledRetention = data.retentionPolicies.filter(p => p.isEnabled);
  if (enabledRetention.length > 0) {
      plan.push({
          id: 'configure-retention',
          title: `Enable ${enabledRetention.length} Retention Policies`,
          details: 'Applying data retention policies across specified locations.',
          duration: 2500,
          execute: () => simulateApiCall(`Enabled ${enabledRetention.length} Retention Policies`, 2500),
      });
  }
  
  const enabledDlp = data.dlpPolicies.filter(p => p.isEnabled);
  if (enabledDlp.length > 0) {
      plan.push({
          id: 'configure-dlp',
          title: `Enable ${enabledDlp.length} DLP Policies`,
          details: 'Applying data loss prevention policies to protect sensitive data.',
          duration: 3000,
          execute: () => simulateApiCall(`Enabled ${enabledDlp.length} DLP Policies`, 3000),
      });
  }

  if (data.auditSettings.isEnabled) {
    plan.push({
      id: 'enable-auditing',
      title: 'Enable Unified Auditing',
      details: `Setting audit log retention to ${data.auditSettings.retentionDays} days.`,
      duration: 1000,
      execute: () => simulateApiCall('Enabled Unified Auditing', 1000),
    });
  }

  if (data.eDiscoveryCase.create) {
    plan.push({
      id: 'create-ediscovery',
      title: 'Create Initial eDiscovery Case',
      details: `Creating case named "${data.eDiscoveryCase.name}".`,
      duration: 1800,
      execute: () => simulateApiCall('Created eDiscovery Case', 1800),
    });
  }
  
  plan.push({
    id: 'verify-deployment',
    title: 'Finalize and Verify Deployment',
    details: 'Running post-deployment health checks.',
    duration: 1500,
    execute: () => simulateApiCall('Deployment Verified', 1500),
  });

  return plan;
};
