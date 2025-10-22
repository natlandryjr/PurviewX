import React from 'react';
import { Button } from '../ui/Button';
import { MicrosoftIcon } from '../icons/MicrosoftIcon';
import { PurviewXLogo } from '../icons/PurviewXLogo';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30">
      <div className="w-full max-w-sm p-8 space-y-8 bg-card rounded-xl shadow-lg">
        <div className="flex justify-center">
            <PurviewXLogo className="h-10 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
            Configuration Accelerator
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to begin your Microsoft Purview deployment.
          </p>
        </div>
        <Button onClick={onLogin} className="w-full" size="lg">
            <MicrosoftIcon className="w-5 h-5 mr-2" />
            Sign in with Microsoft
        </Button>
        <p className="text-center text-xs text-muted-foreground">
            This is a simulated login for demonstration purposes.
        </p>
      </div>
    </div>
  );
};
