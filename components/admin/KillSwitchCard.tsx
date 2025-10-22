import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const KillSwitchCard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();

    const handleEmergencyStop = () => {
        console.log("!!! EMERGENCY STOP INITIATED !!!");
        showToast({
            title: 'Emergency Stop Activated',
            description: 'All automation tasks have been halted.',
        });
        setIsModalOpen(false);
    };
    
    return (
        <>
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Emergency Stop</CardTitle>
                    <CardDescription>
                        Immediately halt all running and scheduled automation tasks. Use only in case of emergency.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full" onClick={() => setIsModalOpen(true)}>
                        Initiate Emergency Stop
                    </Button>
                </CardContent>
            </Card>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleEmergencyStop}
                title="Confirm Emergency Stop"
                description="Are you sure you want to stop all automations? This action is irreversible and may require manual intervention to resume services."
                confirmText="Yes, stop everything"
            />
        </>
    );
};
