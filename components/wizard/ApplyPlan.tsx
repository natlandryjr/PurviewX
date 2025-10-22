
import React, { useState } from 'react';
import { WizardData } from '../../types';
import { generatePlan, PlanStep } from '../../services/planService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlanRunner } from '../common/PlanRunner';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';

interface ApplyPlanProps {
  wizardData: WizardData;
  onComplete: () => void;
}

const PlanPreview: React.FC<{ plan: PlanStep[] }> = ({ plan }) => (
    <div className="space-y-2 max-h-96 overflow-y-auto p-2 bg-secondary/30 rounded-md">
      {plan.map(step => (
        <div key={step.id} className="p-3 bg-card rounded-md">
            <p className="font-medium text-sm">{step.title}</p>
            <p className="text-xs text-muted-foreground">{step.details}</p>
        </div>
      ))}
    </div>
);

export const ApplyPlan: React.FC<ApplyPlanProps> = ({ wizardData, onComplete }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [plan] = useState(() => generatePlan(wizardData));

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                  <ClipboardListIcon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle>Deployment Plan</CardTitle>
                <CardDescription>
                    {isApplying
                      ? 'Applying your configuration...'
                      : 'The following steps will be executed. Review the plan and click "Apply Configuration" to begin.'
                    }
                </CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent>
            {isApplying ? (
                <PlanRunner plan={plan} onComplete={onComplete} />
            ) : (
                <PlanPreview plan={plan} />
            )}
        </CardContent>
        <CardFooter>
            {!isApplying && (
                <Button className="w-full" size="lg" onClick={() => setIsApplying(true)}>
                    Apply Configuration
                </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
};
