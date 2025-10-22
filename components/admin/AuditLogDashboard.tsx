import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';
import { getAuditLogs, AuditLogEntry } from '../../services/auditLogService';
import { Spinner } from '../ui/Spinner';

export const AuditLogDashboard: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = () => {
        setIsLoading(true);
        getAuditLogs().then(data => {
            setLogs(data);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Audit Activity</CardTitle>
                    <CardDescription>A log of important system and user actions.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchLogs} disabled={isLoading}>
                    <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Spinner />
                        </div>
                    ) : logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log.id} className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mr-3 mt-1.5 ${log.status === 'Success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium">{log.activity}</p>
                                    <p className="text-xs text-muted-foreground">
                                        By {log.user} at {new Date(log.timestamp).toLocaleTimeString()} - {log.details}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No audit logs found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
