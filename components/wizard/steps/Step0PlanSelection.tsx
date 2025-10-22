
import React, { useState } from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import { CardTitle, CardDescription } from '../../ui/Card';
import { StarIcon } from '../../icons/StarIcon';
import { CheckIcon } from '../../icons/CheckIcon';

const PlanCard: React.FC<{ title: string; description: string; isSelected?: boolean; onSelect: () => void }> =
 ({ title, description, isSelected, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
              isSelected
                ? 'border-primary ring-2 ring-primary bg-accent'
                : 'border-border hover:border-gray-400'
            }`}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center bg-primary rounded-full">
                  <CheckIcon className="h-4 w-4 text-white" />
                </div>
            )}
            <div className="flex items-start">
                <StarIcon className={`h-8 w-8 mr-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
 };


export const Step0PlanSelection: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
  // This is a placeholder for logic that would change the configuration based on a plan.
  // For now, it's just a UI element.
  // FIX: Replaced const with useState to make plan selection interactive and resolve TS error.
  const [selectedPlan, setSelectedPlan] = useState('baseline');

  return (
    <div className="space-y-4">
      <div>
        <CardTitle>Select a Configuration Plan</CardTitle>
        <CardDescription>Choose a starting template to accelerate your deployment.</CardDescription>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <PlanCard
            title="Baseline Protection"
            description="A foundational set of policies for data classification, retention, and DLP."
            isSelected={selectedPlan === 'baseline'}
            onSelect={() => {
              setSelectedPlan('baseline');
              /* In a real app, this would update the wizard data */
            }}
        />
        <PlanCard
            title="Enhanced Protection"
            description="Includes all baseline features plus advanced DLP and eDiscovery configurations."
            isSelected={selectedPlan === 'enhanced'}
            onSelect={() => {
              setSelectedPlan('enhanced');
              /* In a real app, this would update the wizard data */
            }}
        />
      </div>
    </div>
  );
};
