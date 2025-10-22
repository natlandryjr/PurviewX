
import { useState } from 'react';
import { INITIAL_WIZARD_DATA } from '../constants';
import type { WizardData } from '../types';

export interface UseWizardReturn {
  currentStep: number;
  wizardData: WizardData;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  resetWizard: () => void;
}

export const useWizard = (maxSteps: number): UseWizardReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>(INITIAL_WIZARD_DATA);

  const nextStep = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < maxSteps) {
      setCurrentStep(step);
    }
  };

  const updateData = <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setWizardData(prev => ({ ...prev, [key]: value }));
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setWizardData(INITIAL_WIZARD_DATA);
  }

  return {
    currentStep,
    wizardData,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    resetWizard,
  };
};
