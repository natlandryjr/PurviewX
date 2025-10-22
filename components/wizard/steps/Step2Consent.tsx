
import React, { useState } from 'react';
import { FEATURE_SCOPES } from '../../../constants';
import type { FeatureScope } from '../../../types';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import { simulateAdminConsent } from '../../../services/oauthService';
import { Card, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { CheckIcon } from '../../icons/CheckIcon';
import { PlugIcon } from '../../icons/PlugIcon';
import { Spinner } from '../../ui/Spinner';

const FeatureConsentTile: React.FC<{
  title: string;
  description: string;
  scopes: string[];
  onConnect: () => Promise<void>;
  isConnected: boolean;
}> = ({ title, description, scopes, onConnect, isConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectClick = async () => {
    setIsConnecting(true);
    await onConnect();
    setIsConnecting(false);
  };

  return (
    <Card className="flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-start">
          <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-primary/10'}`}>
            {isConnected 
              ? <CheckIcon className="h-6 w-6 text-green-600" />
              : <PlugIcon className="h-6 w-6 text-primary" />
            }
          </div>
          <div className="ml-4">
            <h4 className="text-base font-semibold text-card-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Permissions Required</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
            {scopes.map(scope => <li key={scope}><code>{scope}</code></li>)}
          </ul>
        </div>
      </div>
      <div className="bg-secondary/50 px-6 py-3">
        {isConnected ? (
          <div className="flex items-center justify-center text-sm font-medium text-green-600">
            <CheckIcon className="w-4 h-4 mr-2" />
            Connected
          </div>
        ) : (
          <Button onClick={handleConnectClick} disabled={isConnecting} className="w-full">
            {isConnecting && <Spinner className="mr-2" />}
            {isConnecting ? 'Waiting for consent...' : 'Connect'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export const Step2Consent: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
  const handleConnect = async (scopes: string[]) => {
    try {
      await simulateAdminConsent(scopes);
      const newConsents = { ...wizardData.consents };
      scopes.forEach(scope => {
        newConsents[scope] = true;
      });
      updateData('consents', newConsents);
    } catch (error) {
      console.error("Consent simulation failed", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <CardTitle>Grant Application Consent</CardTitle>
        <CardDescription>
          Connect each feature by granting consent. This uses a least-privilege approach, ensuring the app only gets the permissions it needs for each task.
        </CardDescription>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* FIX: Cast the result of Object.values to the correct type to resolve TS error. */}
        {(Object.values(FEATURE_SCOPES) as FeatureScope[]).map(feature => (
          <FeatureConsentTile
            key={feature.title}
            title={feature.title}
            description={feature.description}
            scopes={feature.scopes}
            isConnected={feature.scopes.every(scope => wizardData.consents[scope])}
            onConnect={() => handleConnect(feature.scopes)}
          />
        ))}
      </div>
    </div>
  );
};