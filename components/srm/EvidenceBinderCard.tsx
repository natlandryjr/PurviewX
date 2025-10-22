
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { DownloadIcon } from '../icons/DownloadIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { generateEvidenceBinder, generateBinderHtml } from '../../services/evidenceService';
import { WizardData, EvidenceBinder } from '../../types';

interface EvidenceBinderCardProps {
  wizardData: WizardData;
}

export const EvidenceBinderCard: React.FC<EvidenceBinderCardProps> = ({ wizardData }) => {
  const [binder, setBinder] = useState<EvidenceBinder | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [version, setVersion] = useState(1);

  const handleGenerate = () => {
    setIsGenerating(true);
    generateEvidenceBinder(wizardData, version).then(newBinder => {
      setBinder(newBinder);
      setIsGenerating(false);
      setVersion(v => v + 1);
    });
  };
  
  const handleDownload = () => {
    if (!binder) return;
    const htmlContent = generateBinderHtml(binder);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PurviewX-Evidence-Binder-v${binder.version}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate initial binder on mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence Binder</CardTitle>
        <CardDescription>A package of all configuration artifacts.</CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating && !binder ? (
          <div className="flex flex-col items-center justify-center h-24">
            <Spinner />
            <p className="text-sm text-muted-foreground mt-2">Generating initial binder...</p>
          </div>
        ) : binder ? (
          <div className="flex items-center space-x-4">
            <PackageIcon className="w-10 h-10 text-primary" />
            <div>
              <p className="font-semibold">Binder v{binder.version}</p>
              <p className="text-xs text-muted-foreground">Generated: {new Date(binder.timestamp).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground truncate">Checksum: <code className="text-xs">{binder.checksum}</code></p>
            </div>
          </div>
        ) : (
             <p className="text-sm text-muted-foreground text-center">Click "Generate" to create the binder.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
          <Button variant="secondary" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <Spinner className="mr-2" /> : <DownloadIcon className="mr-2 w-4 h-4" />}
              {binder ? 'Regenerate' : 'Generate'}
          </Button>
          <Button onClick={handleDownload} disabled={!binder || isGenerating}>Download HTML</Button>
      </CardFooter>
    </Card>
  );
};
