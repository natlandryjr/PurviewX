import React, { useState, useEffect, useRef } from 'react';
import { PlanStep } from '../../services/planService';
import { CheckIcon } from '../icons/CheckIcon';
import { Spinner } from '../ui/Spinner';

interface PlanRunnerProps {
  plan: PlanStep[];
  onComplete: () => void;
}

type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

export const PlanRunner: React.FC<PlanRunnerProps> = ({ plan, onComplete }) => {
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    () => Object.fromEntries(plan.map(step => [step.id, 'pending']))
  );
  const [isComplete, setIsComplete] = useState(false);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to use the correct type for the `setTimeout` return value in a browser environment.
  const runnerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let currentStepIndex = 0;

    const runNextStep = async () => {
      if (currentStepIndex >= plan.length) {
        setIsComplete(true);
        runnerTimeoutRef.current = setTimeout(onComplete, 1500); // Wait a bit before calling onComplete
        return;
      }

      const step = plan[currentStepIndex];
      setStepStatuses(prev => ({ ...prev, [step.id]: 'running' }));

      try {
        await step.execute(null as any); // wizardData is not needed for mock execution
        setStepStatuses(prev => ({ ...prev, [step.id]: 'completed' }));
      } catch (error) {
        setStepStatuses(prev => ({ ...prev, [step.id]: 'failed' }));
        console.error(`Plan step ${step.title} failed`, error);
        // Stop execution on failure
        return;
      }
      
      currentStepIndex++;
      runNextStep();
    };

    runNextStep();

    return () => {
      if (runnerTimeoutRef.current) {
        clearTimeout(runnerTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, onComplete]);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {plan.map(step => (
          <li key={step.id} className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-1">
              {stepStatuses[step.id] === 'running' && <Spinner className="w-5 h-5 text-primary" />}
              {stepStatuses[step.id] === 'completed' && <CheckIcon className="w-5 h-5 text-green-500" />}
              {stepStatuses[step.id] === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
              {stepStatuses[step.id] === 'failed' && <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">!</div>}
            </div>
            <div>
              <p className={`font-medium text-sm ${stepStatuses[step.id] === 'pending' ? 'text-muted-foreground' : ''}`}>
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.details}</p>
            </div>
          </li>
        ))}
      </ul>
      {isComplete && (
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="font-semibold text-green-700">Deployment Complete!</p>
        </div>
      )}
    </div>
  );
};
