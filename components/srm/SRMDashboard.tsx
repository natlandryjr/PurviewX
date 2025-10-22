import React from 'react';
import type { SrmControl, WizardData } from '../../types';
import { ReadinessScore } from './ReadinessScore';
import { SRMHeatmap } from './SRMHeatmap';
import { SRMTable } from './SRMTable';
import { EvidenceBinderCard } from './EvidenceBinderCard';
import { DlpTrendChart } from '../charts/DlpTrendChart';

// Mock SRM controls data. In a real app, this would be fetched from an API.
const MOCK_SRM_CONTROLS: SrmControl[] = [
  { id: 'c1', controlName: 'Data Classification', description: 'Sensitivity labels are defined and published.', status: 'Compliant', score: 10, maxScore: 10, evidence: [{id: 'e1', name: 'Sensitivity Label Policy', type: 'Policy', details: 'Policy GUID: ...'}] },
  { id: 'c2', controlName: 'Data Loss Prevention', description: 'DLP policies are active for key locations.', status: 'Compliant', score: 10, maxScore: 10, evidence: [] },
  { id: 'c3', controlName: 'Information Retention', description: 'Baseline retention policies are configured.', status: 'In Progress', score: 5, maxScore: 10, evidence: [] },
  { id: 'c4', controlName: 'Insider Risk Management', description: 'Policies to detect risky user activities.', status: 'Non-compliant', score: 0, maxScore: 10, evidence: [] },
  { id: 'c5', controlName: 'eDiscovery Holds', description: 'Legal holds are functional.', status: 'Compliant', score: 5, maxScore: 5, evidence: [] },
  { id: 'c6', controlName: 'Audit Logging', description: 'Unified audit log is enabled and retained.', status: 'Not Assessed', score: 0, maxScore: 5, evidence: [] },
  { id: 'c7', controlName: 'Communication Compliance', description: 'Policies for monitoring Teams/Exchange comms.', status: 'Non-compliant', score: 0, maxScore: 10, evidence: [] },
  { id: 'c8', controlName: 'Records Management', description: 'Advanced records management features are configured.', status: 'Not Assessed', score: 0, maxScore: 10, evidence: [] },
];

interface SRMDashboardProps {
    wizardData: WizardData;
}

export const SRMDashboard: React.FC<SRMDashboardProps> = ({ wizardData }) => {
  // In a real app, you might adjust controls based on wizardData
  const controls = MOCK_SRM_CONTROLS;

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Security & Risk Management Dashboard</h1>
            <p className="text-muted-foreground mt-1">
                An overview of your Microsoft Purview compliance posture.
            </p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore controls={controls} />
        <SRMHeatmap controls={controls} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <DlpTrendChart />
        </div>
        <EvidenceBinderCard wizardData={wizardData} />
      </div>
      <div>
        <SRMTable controls={controls} />
      </div>
    </div>
  );
};
