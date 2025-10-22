
import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface WizardStepProps {
  children: React.ReactNode;
}

export const WizardStep: React.FC<WizardStepProps> = ({ children }) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};
