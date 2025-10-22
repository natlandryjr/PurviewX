// Mock audit log service.

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  activity: string;
  details: string;
  status: 'Success' | 'Failure';
}

const mockLogs: AuditLogEntry[] = [
    { id: 'log1', timestamp: new Date().toISOString(), user: 'Alex Wilber', activity: 'Create DLP Policy', details: 'Policy: U.S. Financial Data', status: 'Success' },
    { id: 'log2', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), user: 'Alex Wilber', activity: 'Update Sensitivity Label', details: 'Label: Confidential', status: 'Success' },
    { id: 'log3', timestamp: new Date(Date.now() - 60000 * 25).toISOString(), user: 'system', activity: 'Run Compliance Job', details: 'Job ID: compliance-run-123', status: 'Success' },
];

export const getAuditLogs = async (): Promise<AuditLogEntry[]> => {
    console.log('Fetching audit logs...');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...mockLogs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }, 800);
    });
};
