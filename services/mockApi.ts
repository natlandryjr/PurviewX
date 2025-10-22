
import type { WizardData } from '../types';

export const saveWizardConfiguration = (data: WizardData): Promise<{ success: true }> => {
  console.log("Saving wizard configuration:", data);
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Configuration saved successfully.");
      resolve({ success: true });
    }, 1500);
  });
};
