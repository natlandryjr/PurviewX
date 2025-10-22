
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { SrmControl } from '../../types';

interface ReadinessScoreProps {
  controls: SrmControl[];
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({ controls }) => {
  const totalScore = controls.reduce((acc, control) => acc + control.score, 0);
  const maxScore = controls.reduce((acc, control) => acc + control.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  const strokeDasharray = 2 * Math.PI * 45; // Circumference
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness Score</CardTitle>
        <CardDescription>Based on implemented controls.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{
                strokeDasharray,
                strokeDashoffset,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 0.5s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-primary">{percentage}%</span>
            <span className="text-sm text-muted-foreground">Ready</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
