/**
 * Mock Error Service. In a real app, this would integrate with a monitoring service
 * like Sentry, LogRocket, or Application Insights.
 */
export const errorService = {
  report: (error: Error, context?: Record<string, any>) => {
    // Log the error to the console for demonstration purposes.
    console.error('[Error Service] Reporting error:', error, context || '');
  },
};
