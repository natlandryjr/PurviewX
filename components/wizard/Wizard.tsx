
import React, { useState } from 'react';
import { WIZARD_STEPS } from '../../constants';
import { useWizard } from '../../hooks/useWizard';
import type { WizardData } from '../../types';

import { StepIndicator } from './StepIndicator';
import { WizardStep } from './WizardStep';
import { Step0PlanSelection } from './steps/Step0PlanSelection';
import { Step1CloudSelection } from './steps/Step1CloudSelection';
import { Step2Consent } from './steps/Step2Consent';
import { Step3CustomSITs } from './steps/Step3CustomSITs';
import { Step4SensitivityLabels } from './steps/Step4SensitivityLabels';
import { Step5Retention } from './steps/Step5Retention';
import { Step6DLP } from './steps/Step6DLP';
import { Step7eDiscoveryAudit } from './steps/Step7eDiscoveryAudit';
import { Step8Review } from './steps/Step8Review';
import { ApplyPlan } from './ApplyPlan';

import { Button } from '../ui/Button';

interface WizardProps {
  onComplete: (data: WizardData) => void;
}

export const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [isApplying, setIsApplying] = useState(false);
  const wizard = useWizard(WIZARD_STEPS.length);

  const steps = [
    <Step0PlanSelection {...wizard} />,
    <Step1CloudSelection {...wizard} />,
    <Step2Consent {...wizard} />,
    <Step3CustomSITs {...wizard} />,
    <Step4SensitivityLabels {...wizard} />,
    <Step5Retention {...wizard} />,
    <Step6DLP {...wizard} />,
    <Step7eDiscoveryAudit {...wizard} />,
    <Step8Review {...wizard} />,
  ];

  const handleGeneratePlan = () => {
    setIsApplying(true);
  };

  if (isApplying) {
    return <ApplyPlan wizardData={wizard.wizardData} onComplete={() => onComplete(wizard.wizardData)} />;
  }
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <StepIndicator currentStep={wizard.currentStep} totalSteps={WIZARD_STEPS.length} />
      <WizardStep>
        {steps[wizard.currentStep]}
      </WizardStep>
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={wizard.prevStep}
          disabled={wizard.currentStep === 0}
        >
          Back
        </Button>
        {wizard.currentStep < WIZARD_STEPS.length - 1 ? (
          <Button onClick={wizard.nextStep}>Next</Button>
        ) : (
          <Button onClick={handleGeneratePlan}>Review & Generate Plan</Button>
        )}
      </div>
    </div>
  );
};
