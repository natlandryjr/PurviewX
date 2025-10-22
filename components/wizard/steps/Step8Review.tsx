
import React from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import { CardTitle, CardDescription } from '../../ui/Card';

const ReviewSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <div className="p-4 bg-secondary/50 rounded-md space-y-2">{children}</div>
  </div>
);

const ReviewItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

export const Step8Review: React.FC<UseWizardReturn> = ({ wizardData }) => {
  const enabledRetention = wizardData.retentionPolicies.filter(p => p.isEnabled).length;
  const enabledDlp = wizardData.dlpPolicies.filter(p => p.isEnabled).length;

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>Review Your Configuration</CardTitle>
        <CardDescription>
          Please review the configuration below before generating the deployment plan.
        </CardDescription>
      </div>
      <div className="space-y-6 pt-2 max-h-[60vh] overflow-y-auto pr-2">
        <ReviewSection title="Core Setup">
          <ReviewItem label="Cloud Environment" value={wizardData.cloudEnvironment} />
          <ReviewItem label="Consented Permission Groups" value={`${Object.keys(wizardData.consents).length} groups`} />
        </ReviewSection>

        <ReviewSection title="Data Classification">
          <ReviewItem label="Custom SITs to Import" value={`${wizardData.customSits.length} SITs`} />
          <ReviewItem label="Sensitivity Labels to Configure" value={`${wizardData.sensitivityLabels.length} labels`} />
        </ReviewSection>
        
        <ReviewSection title="Governance & Protection">
          <ReviewItem label="Retention Policies to Enable" value={`${enabledRetention} policies`} />
          <ReviewItem label="DLP Policies to Enable" value={`${enabledDlp} policies`} />
        </ReviewSection>

        <ReviewSection title="eDiscovery & Audit">
          <ReviewItem label="Unified Auditing" value={wizardData.auditSettings.isEnabled ? `Enabled (${wizardData.auditSettings.retentionDays} days)` : 'Disabled'} />
          <ReviewItem label="Create eDiscovery Case" value={wizardData.eDiscoveryCase.create ? `Yes ("${wizardData.eDiscoveryCase.name}")` : 'No'} />
        </ReviewSection>
      </div>
    </div>
  );
};
