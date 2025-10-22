export interface SupportTicket {
    issueType: 'Technical' | 'Billing' | 'General';
    description: string;
}

/**
 * Mock Support Service. In a real app, this would make an API call to a ticketing system
 * like Zendesk, Jira Service Desk, etc.
 */
export const supportService = {
  createTicket: async (ticket: SupportTicket): Promise<{ ticketId: string }> => {
    console.log('[Support Service] Creating ticket:', ticket);
    // Simulate network delay for API call
    await new Promise(res => setTimeout(res, 1200));
    const ticketId = `SUP-${Math.floor(Math.random() * 90000) + 10000}`;
    console.log(`[Support Service] Ticket created: ${ticketId}`);
    return { ticketId };
  },
};
