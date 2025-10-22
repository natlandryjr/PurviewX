import React from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import type { RetentionPolicy } from '../../../types';
import { CardTitle, CardDescription } from '../../ui/Card';
import { ClockIcon } from '../../icons/ClockIcon';

const PolicyRow: React.FC<{ policy: RetentionPolicy; onToggle: (id: string) => void; }> = ({ policy, onToggle }) => {
    return (
        <div className="flex items-center p-3 border rounded-md">
            <div className="flex items-center flex-grow">
                 <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                    <ClockIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-grow">
                    <p className="font-medium">{policy.name}</p>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                </div>
            </div>
            <div className="ml-4 flex items-center">
                <label htmlFor={`toggle-${policy.id}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id={`toggle-${policy.id}`}
                            className="sr-only peer"
                            checked={policy.isEnabled}
                            onChange={() => onToggle(policy.id)}
                        />
                        <div className="block bg-gray-200 peer-checked:bg-primary w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export const Step5Retention: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
    const handleToggle = (id: string) => {
        const updatedPolicies = wizardData.retentionPolicies.map(policy =>
            policy.id === id ? { ...policy, isEnabled: !policy.isEnabled } : policy
        );
        updateData('retentionPolicies', updatedPolicies);
    };

    return (
        <div className="space-y-6">
            <div>
                <CardTitle>Configure Retention Policies</CardTitle>
                <CardDescription>
                    Select the retention policies to be created and applied in the tenant.
                </CardDescription>
            </div>
            <div className="space-y-3 pt-2">
                {wizardData.retentionPolicies.map(policy => (
                    <PolicyRow key={policy.id} policy={policy} onToggle={handleToggle} />
                ))}
            </div>
        </div>
    );
};
