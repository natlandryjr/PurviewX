import React, { useState } from 'react';
import { Wizard } from './components/wizard/Wizard';
import { LoginScreen } from './components/common/LoginScreen';
import { SRMDashboard } from './components/srm/SRMDashboard';
import type { WizardData } from './types';
import { DemoBanner } from './components/common/DemoBanner';
import { PurviewXLogo } from './components/icons/PurviewXLogo';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWizardComplete, setIsWizardComplete] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setIsWizardComplete(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-secondary/30 text-card-foreground">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <PurviewXLogo className="h-8 text-primary" />
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <DemoBanner />
        <div className="mt-4">
          {isWizardComplete && wizardData ? (
            <SRMDashboard wizardData={wizardData} />
          ) : (
            <Wizard onComplete={handleWizardComplete} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
