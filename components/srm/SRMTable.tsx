import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { SrmControl } from '../../types';
import { Button } from '../ui/Button';
import { EvidenceModal } from './EvidenceModal';

interface SRMTableProps {
  controls: SrmControl[];
}

const statusColorMap: Record<SrmControl['status'], string> = {
    'Compliant': 'bg-green-100 text-green-800',
    'Non-compliant': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Not Assessed': 'bg-gray-100 text-gray-800',
};

export const SRMTable: React.FC<SRMTableProps> = ({ controls }) => {
  const [selectedControl, setSelectedControl] = useState<SrmControl | null>(null);

  return (
    <>
        <Card>
        <CardHeader>
            <CardTitle>Compliance Controls</CardTitle>
            <CardDescription>Detailed status of all monitored compliance controls.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {controls.map(control => (
                            <tr key={control.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{control.controlName}</div>
                                    <div className="text-sm text-gray-500">{control.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[control.status]}`}>
                                        {control.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {control.score} / {control.maxScore}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedControl(control)}>
                                        View Evidence
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
        </Card>
        {selectedControl && (
            <EvidenceModal
                isOpen={!!selectedControl}
                onClose={() => setSelectedControl(null)}
                control={selectedControl}
            />
        )}
    </>
  );
};
