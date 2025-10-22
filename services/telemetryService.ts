
/**
 * Mock Telemetry Service. In a real app, this would send data to a service like Application Insights.
 */
interface TelemetryEvent {
  name: string;
  properties?: Record<string, any>;
}

export const trackEvent = (event: TelemetryEvent) => {
  console.log(`[Telemetry] Event tracked: ${event.name}`, event.properties || '');
};

export const trackPageView = (pageName: string) => {
    console.log(`[Telemetry] Page view: ${pageName}`);
};

export const trackException = (error: Error) => {
    console.error(`[Telemetry] Exception tracked:`, error);
};
