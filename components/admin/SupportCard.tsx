import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { supportService, SupportTicket } from '../../services/supportService';
import { useToast } from '../../hooks/useToast';
import { Spinner } from '../ui/Spinner';

export const SupportCard: React.FC = () => {
    const [issueType, setIssueType] = useState<SupportTicket['issueType']>('Technical');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            showToast({ title: 'Error', description: 'Please provide a description.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await supportService.createTicket({ issueType, description });
            showToast({ title: 'Success', description: `Support ticket ${result.ticketId} has been created.` });
            setDescription('');
        } catch (error) {
            showToast({ title: 'Error', description: 'Failed to create support ticket.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Support Request</CardTitle>
                <CardDescription>Need help? Open a support ticket with our team.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="issue-type">Issue Type</Label>
                        <Select id="issue-type" value={issueType} onChange={e => setIssueType(e.target.value as SupportTicket['issueType'])}>
                            <option value="Technical">Technical Issue</option>
                            <option value="Billing">Billing Question</option>
                            <option value="General">General Inquiry</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full mt-1 p-2 border rounded-md bg-transparent text-sm"
                            placeholder="Please describe your issue..."
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Spinner className="mr-2" />}
                        Submit Ticket
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
