// FIX: Create Step7eDiscoveryAudit.tsx component.

import React from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import { CardTitle, CardDescription } from '../../ui/Card';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { ArchiveIcon } from '../../icons/ArchiveIcon';
import { SearchIcon } from '../../icons/SearchIcon';


export const Step7eDiscoveryAudit: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
  const { auditSettings, eDiscoveryCase } = wizardData;

  const handleAuditToggle = () => {
    updateData('auditSettings', { ...auditSettings, isEnabled: !auditSettings.isEnabled });
  };
  
  const handleAuditRetentionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateData('auditSettings', { ...auditSettings, retentionDays: parseInt(e.target.value, 10) });
  };
  
  const handleEDiscoveryToggle = () => {
    updateData('eDiscoveryCase', { ...eDiscoveryCase, create: !eDiscoveryCase.create });
  };

  const handleEDiscoveryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData('eDiscoveryCase', { ...eDiscoveryCase, name: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>eDiscovery & Audit</CardTitle>
        <CardDescription>
          Configure initial eDiscovery settings and enable unified auditing.
        </CardDescription>
      </div>
      
      <div className="space-y-6 pt-4">
        {/* Audit Settings */}
        <div className="p-4 border rounded-md">
           <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ArchiveIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 flex-grow">
                  <h4 className="font-medium">Unified Auditing</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable the unified audit log to capture user and admin activities across Microsoft 365 services.
                  </p>
              </div>
              <div className="ml-4 flex items-center">
                <label htmlFor="audit-toggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="audit-toggle" 
                      className="sr-only peer" 
                      checked={auditSettings.isEnabled}
                      onChange={handleAuditToggle}
                    />
                    <div className="block bg-gray-200 peer-checked:bg-primary w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
                  </div>
                </label>
              </div>
          </div>
          {auditSettings.isEnabled && (
              <div className="mt-4 pl-14">
                  <Label htmlFor="audit-retention">Audit Log Retention</Label>
                  <Select
                      id="audit-retention"
                      value={auditSettings.retentionDays}
                      onChange={handleAuditRetentionChange}
                      className="mt-1"
                  >
                      <option value="90">90 Days</option>
                      <option value="180">180 Days</option>
                      <option value="365">1 Year (Default)</option>
                      <option value="1825">5 Years</option>
                      <option value="3650">10 Years</option>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Longer retention may require specific licensing.</p>
              </div>
          )}
        </div>

        {/* eDiscovery Settings */}
         <div className="p-4 border rounded-md">
           <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 flex-grow">
                  <h4 className="font-medium">Initial eDiscovery Case</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a placeholder eDiscovery (Standard) case to get started.
                  </p>
              </div>
               <div className="ml-4 flex items-center">
                <label htmlFor="ediscovery-toggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="ediscovery-toggle" 
                      className="sr-only peer" 
                      checked={eDiscoveryCase.create}
                      onChange={handleEDiscoveryToggle}
                    />
                    <div className="block bg-gray-200 peer-checked:bg-primary w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
                  </div>
                </label>
              </div>
          </div>
           {eDiscoveryCase.create && (
              <div className="mt-4 pl-14">
                  <Label htmlFor="ediscovery-name">Case Name</Label>
                   <Input
                      id="ediscovery-name"
                      value={eDiscoveryCase.name}
                      onChange={handleEDiscoveryNameChange}
                      className="mt-1"
                  />
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
