import React, { useState, useRef } from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import { CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { UploadIcon } from '../../icons/UploadIcon';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { Spinner } from '../../ui/Spinner';
import { parseSitXml } from '../../../services/sitImportService';
import type { CustomSit } from '../../../types';

export const Step3CustomSITs: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const content = await file.text();
      const newSit = await parseSitXml(content);
      
      if (wizardData.customSits.some(sit => sit.id === newSit.id)) {
        setError(`SIT with ID "${newSit.id}" has already been imported.`);
      } else {
        updateData('customSits', [...wizardData.customSits, newSit]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during parsing.');
    } finally {
      setIsLoading(false);
      // Reset file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemoveSit = (sitId: string) => {
    updateData('customSits', wizardData.customSits.filter(sit => sit.id !== sitId));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>Import Custom Sensitive Info Types (SITs)</CardTitle>
        <CardDescription>
          Upload your custom SIT definitions in XML format. These will be imported into your Purview environment.
        </CardDescription>
      </div>
      <div className="space-y-4">
         <div 
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Drag and drop your SIT XML files here or
          </span>
           <Button variant="ghost" className="mt-2" onClick={triggerFileSelect} disabled={isLoading}>
             {isLoading && <Spinner className="mr-2 h-4 w-4" />}
             browse to upload
           </Button>
           <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".xml"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        
        <div>
          <h4 className="text-base font-medium mb-2">Imported SITs ({wizardData.customSits.length})</h4>
          {wizardData.customSits.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {wizardData.customSits.map((sit: CustomSit) => (
                <li key={sit.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div className="flex items-center">
                    <FileTextIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{sit.name}</p>
                      <p className="text-xs text-muted-foreground">{sit.description}</p>
                    </div>
                  </div>
                   <Button variant="ghost" size="sm" onClick={() => handleRemoveSit(sit.id)}>Remove</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No SITs have been imported yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
