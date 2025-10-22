import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { CheckIcon } from '../icons/CheckIcon';
import { InfoIcon } from '../icons/InfoIcon';
import { verifySensitivityLabelPolicy, VerificationResult } from '../../services/policyVerificationService';
import { SensitivityLabel } from '../../types';

interface PolicyVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: SensitivityLabel;
  allLabels: SensitivityLabel[];
}

export const PolicyVerificationModal: React.FC<PolicyVerificationModalProps> = ({ isOpen, onClose, label, allLabels }) => {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setResult(null);
      verifySensitivityLabelPolicy(label, allLabels)
        .then(res => {
          setResult(res);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, label, allLabels]);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Verifying: ${label.name}`}>
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <Spinner className="w-8 h-8" />
          <p className="mt-4 text-muted-foreground">Running verification checks...</p>
        </div>
      )}
      {!isLoading && result && (
        <div className="space-y-4">
          {result.isValid ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Verification Passed</h3>
                <p className="text-sm text-muted-foreground mt-1">No issues found based on best practices.</p>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center p-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <InfoIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium">Potential Issues Found</h3>
                 <ul className="mt-4 space-y-2 text-sm text-left list-disc list-inside bg-secondary p-4 rounded-md">
                   {result.issues.map((issue, index) => <li key={index}>{issue}</li>)}
                 </ul>
            </div>
          )}
           <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
