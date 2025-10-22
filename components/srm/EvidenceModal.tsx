
import React from 'react';
import { SrmControl, SrmEvidence } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FileTextIcon } from '../icons/FileTextIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  control: SrmControl;
}

const EvidenceIcon: React.FC<{ type: SrmEvidence['type'] }> = ({ type }) => {
  switch (type) {
    case 'Configuration':
      return <SettingsIcon className="h-5 w-5 text-muted-foreground" />;
    case 'Policy':
      return <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />;
    case 'Report':
      return <FileTextIcon className="h-5 w-5 text-muted-foreground" />;
    default:
      return null;
  }
};

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, control }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Evidence for: ${control.controlName}`}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{control.description}</p>
        <div>
          <h4 className="font-medium text-sm mb-2">Attached Evidence</h4>
          {control.evidence.length > 0 ? (
            <ul className="space-y-3">
              {control.evidence.map(item => (
                <li key={item.id} className="flex items-start p-3 bg-secondary rounded-md">
                   <div className="flex-shrink-0 mr-3 mt-1">
                      <EvidenceIcon type={item.type} />
                   </div>
                   <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                   </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No evidence has been attached for this control.</p>
          )}
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
