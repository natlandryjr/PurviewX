import React from 'react';
import { CLOUD_ENVIRONMENTS } from '../../../utils/cloud';
import type { CloudEnvironment } from '../../../types';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import { CardTitle, CardDescription } from '../../ui/Card';

export const Step1CloudSelection: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
  return (
    <div className="space-y-4">
      <div>
        <CardTitle>Select Cloud Environment</CardTitle>
        <CardDescription>Choose the Microsoft cloud where your tenant is located.</CardDescription>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {CLOUD_ENVIRONMENTS.map((env) => (
          <label
            key={env}
            className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${
              wizardData.cloudEnvironment === env
                ? 'border-primary ring-2 ring-primary bg-accent'
                : 'border-border hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="cloud-environment"
              value={env}
              checked={wizardData.cloudEnvironment === env}
              onChange={(e) => updateData('cloudEnvironment', e.target.value as CloudEnvironment)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-3 font-medium text-sm text-card-foreground">{env}</span>
          </label>
        ))}
      </div>
    </div>
  );
};