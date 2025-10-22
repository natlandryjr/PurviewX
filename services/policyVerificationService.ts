import { SensitivityLabel } from '../types';

export interface VerificationResult {
  isValid: boolean;
  issues: string[];
}

/**
 * Simulates verifying a sensitivity label policy against best practices.
 * In a real app, this might make an API call to a backend service with more complex logic.
 */
export const verifySensitivityLabelPolicy = (
  label: SensitivityLabel,
  allLabels: SensitivityLabel[]
): Promise<VerificationResult> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const issues: string[] = [];
      
      // Example rule: "Highly Confidential" should have a higher priority than "Confidential".
      if (label.name === 'Highly Confidential') {
        const confidentialLabel = allLabels.find(l => l.name === 'Confidential');
        if (confidentialLabel && label.priority <= confidentialLabel.priority) {
          issues.push('"Highly Confidential" must have a higher priority (be ordered above) "Confidential".');
        }
      }

      // Example rule: Label descriptions should not be empty.
      if (!label.description?.trim()) {
        issues.push('Label description should not be empty.');
      }
      
      resolve({
        isValid: issues.length === 0,
        issues,
      });
    }, 750); // Simulate network latency
  });
};
