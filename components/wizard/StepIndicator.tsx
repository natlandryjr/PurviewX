
import React from 'react';
import { WIZARD_STEPS } from '../../constants';
import { CheckIcon } from '../icons/CheckIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {WIZARD_STEPS.map((step, stepIdx) => (
          <li key={step} className={`relative ${stepIdx !== WIZARD_STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-primary rounded-full">
                  <CheckIcon className="h-5 w-5 text-white" />
                </span>
                <span className="sr-only">{step}</span>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-primary rounded-full">
                  <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                </span>
                <span className="sr-only">{step}</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-gray-300 rounded-full" />
                <span className="sr-only">{step}</span>
              </>
            )}
             <span className="absolute top-10 left-1/2 -translate-x-1/2 text-center text-xs w-28 font-medium text-gray-500">{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};
