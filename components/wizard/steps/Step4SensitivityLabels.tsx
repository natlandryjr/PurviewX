import React, { useState } from 'react';
import type { UseWizardReturn } from '../../../hooks/useWizard';
import type { SensitivityLabel } from '../../../types';
import { CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { EditIcon } from '../../icons/EditIcon';
import { Modal } from '../../ui/Modal';
import { PolicyVerificationModal } from '../PolicyVerificationModal';
import { EyeIcon } from '../../icons/EyeIcon';

const LabelRow: React.FC<{
  label: SensitivityLabel;
  onToggle: (id: string) => void;
  onEdit: (label: SensitivityLabel) => void;
  onVerify: (label: SensitivityLabel) => void;
}> = ({ label, onToggle, onEdit, onVerify }) => {
  return (
    <div className="flex items-center p-3 border rounded-md">
      <div className="flex items-center flex-grow">
        <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: label.color }}></div>
        <div className="flex-grow">
          <p className="font-medium">{label.name}</p>
          <p className="text-sm text-muted-foreground">{label.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
         <Button variant="ghost" size="sm" onClick={() => onVerify(label)} title="Verify Policy">
            <EyeIcon className="w-4 h-4" />
         </Button>
         <Button variant="ghost" size="sm" onClick={() => onEdit(label)} title="Edit Label">
            <EditIcon className="w-4 h-4" />
         </Button>
        <label htmlFor={`toggle-${label.id}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              id={`toggle-${label.id}`} 
              className="sr-only peer" 
              checked={label.isEnabled}
              onChange={() => onToggle(label.id)}
            />
            <div className="block bg-gray-200 peer-checked:bg-primary w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export const Step4SensitivityLabels: React.FC<UseWizardReturn> = ({ wizardData, updateData }) => {
  const [editingLabel, setEditingLabel] = useState<SensitivityLabel | null>(null);
  const [verifyingLabel, setVerifyingLabel] = useState<SensitivityLabel | null>(null);

  const handleToggle = (id: string) => {
    const updatedLabels = wizardData.sensitivityLabels.map(label =>
      label.id === id ? { ...label, isEnabled: !label.isEnabled } : label
    );
    updateData('sensitivityLabels', updatedLabels);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabel) return;
    const updatedLabels = wizardData.sensitivityLabels.map(label =>
      label.id === editingLabel.id ? editingLabel : label
    );
    updateData('sensitivityLabels', updatedLabels);
    setEditingLabel(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>Configure Sensitivity Labels</CardTitle>
        <CardDescription>
          Enable and customize the sensitivity labels to be deployed. Higher priority labels appear first.
        </CardDescription>
      </div>
      <div className="space-y-3">
        {wizardData.sensitivityLabels
          .sort((a, b) => b.priority - a.priority)
          .map(label => (
            <LabelRow 
                key={label.id} 
                label={label} 
                onToggle={handleToggle} 
                onEdit={setEditingLabel}
                onVerify={setVerifyingLabel}
            />
        ))}
      </div>
      
      {editingLabel && (
        <Modal isOpen={!!editingLabel} onClose={() => setEditingLabel(null)} title={`Edit: ${editingLabel.name}`}>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <Label htmlFor="label-name">Label Name</Label>
              <Input id="label-name" value={editingLabel.name} onChange={e => setEditingLabel({...editingLabel, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="label-desc">Description</Label>
              <Input id="label-desc" value={editingLabel.description} onChange={e => setEditingLabel({...editingLabel, description: e.target.value })} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setEditingLabel(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {verifyingLabel && (
        <PolicyVerificationModal
            isOpen={!!verifyingLabel}
            onClose={() => setVerifyingLabel(null)}
            label={verifyingLabel}
            allLabels={wizardData.sensitivityLabels}
        />
      )}

    </div>
  );
};
