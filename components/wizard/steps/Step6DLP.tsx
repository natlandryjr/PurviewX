import React from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import type { DlpPolicy } from '../../../types';
import { CardTitle, CardDescription } from '../../ui/Card';
import { ShieldCheckIcon } from '../../icons/ShieldCheckIcon';
import { MailIcon } from '../../icons/MailIcon';
import { SharepointIcon } from '../../icons/SharepointIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { MonitorIcon } from '../../icons/MonitorIcon';

const LocationIcon: React.FC<{ location: string }> = ({ location }) => {
    const iconClass = "w-4 h-4 text-muted-foreground";
    switch (location) {
        case 'Exchange': return <MailIcon className={iconClass} title="Exchange" />;
        case 'SharePoint': return <SharepointIcon className={iconClass} title="SharePoint" />;
        case 'OneDrive': return <UsersIcon className={iconClass} title="OneDrive" />;
        case 'Teams': return <UsersIcon className={iconClass} title="Teams" />;
        case 'Devices': return <MonitorIcon className={iconClass} />;
        default: return null;
    }
}

const PolicyRow: React.FC<{ policy: DlpPolicy; onToggle: (id: string) => void; }> = ({ policy, onToggle }) => {
    return (
        <div className="flex items-center p-3 border rounded-md">
            <div className="flex items-center flex-grow">
                 <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                    <ShieldCheckIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-grow">
                    <p className="font-medium">{policy.name}</p>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                        {policy.locations.map(loc => <LocationIcon key={loc} location={loc} />)}
                    </div>
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

export const Step6DLP: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
    const handleToggle = (id: string) => {
        const updatedPolicies = wizardData.dlpPolicies.map(policy =>
            policy.id === id ? { ...policy, isEnabled: !policy.isEnabled } : policy
        );
        updateData('dlpPolicies', updatedPolicies);
    };

    return (
        <div className="space-y-6">
            <div>
                <CardTitle>Configure DLP Policies</CardTitle>
                <CardDescription>
                    Select the Data Loss Prevention (DLP) policies to be deployed to protect sensitive information.
                </CardDescription>
            </div>
            <div className="space-y-3 pt-2">
                {wizardData.dlpPolicies.map(policy => (
                    <PolicyRow key={policy.id} policy={policy} onToggle={handleToggle} />
                ))}
            </div>
        </div>
    );
};
