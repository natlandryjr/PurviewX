import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { DownloadIcon } from '../icons/DownloadIcon';
import { FileJsonIcon } from '../icons/FileJsonIcon';
import { FileCsvIcon } from '../icons/FileCsvIcon';

interface ExportDropdownProps {
  onExportJson: () => void;
  onExportCsv: () => void;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExportJson, onExportCsv }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <Button onClick={() => setIsOpen(!isOpen)}>
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </div>
            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1" role="none">
                        <button
                            onClick={() => { onExportJson(); setIsOpen(false); }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                            role="menuitem"
                        >
                            <FileJsonIcon className="w-4 h-4 mr-2" />
                            Export as JSON
                        </button>
                        <button
                            onClick={() => { onExportCsv(); setIsOpen(false); }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                            role="menuitem"
                        >
                            <FileCsvIcon className="w-4 h-4 mr-2" />
                            Export as CSV
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
