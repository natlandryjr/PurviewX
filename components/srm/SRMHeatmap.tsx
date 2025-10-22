
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { SrmControl } from '../../types';

interface SRMHeatmapProps {
  controls: SrmControl[];
}

const statusColorMap = {
  'Compliant': 'bg-green-500',
  'Non-compliant': 'bg-red-500',
  'In Progress': 'bg-yellow-500',
  'Not Assessed': 'bg-gray-400',
};


export const SRMHeatmap: React.FC<SRMHeatmapProps> = ({ controls }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Compliance Posture Heatmap</CardTitle>
        <CardDescription>At-a-glance view of all compliance controls.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {controls.map(control => (
             <div key={control.id} className="group relative">
                <div className={`w-full aspect-square rounded ${statusColorMap[control.status]}`} />
                <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="font-bold">{control.controlName}</p>
                    <p>Status: {control.status}</p>
                </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4 mt-4 text-xs">
            {Object.entries(statusColorMap).map(([status, color]) => (
                <div key={status} className="flex items-center">
                    <div className={`w-3 h-3 rounded-sm mr-2 ${color}`} />
                    <span>{status}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
