// Mock API client. In a real app, this would use fetch or axios to make real HTTP requests.

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    console.log(`[API Client] GET: ${endpoint}`);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 300));
    // In a real app, you would return fetched data here.
    return {} as T;
  },
  post: async <T>(endpoint: string, body: any): Promise<T> => {
    console.log(`[API Client] POST: ${endpoint} with body:`, body);
    await new Promise(res => setTimeout(res, 500));
    // In a real app, you would return the response from the server.
    return { success: true } as unknown as T;
  },
};
