// Mock token manager. In a real app, this would handle OAuth tokens.

const MOCK_TOKEN = 'mock-access-token-';
let tokenCounter = 0;

/**
 * Simulates acquiring an access token for a given scope.
 * @param scope The API scope (e.g., 'https://graph.microsoft.com/.default')
 * @returns A mock access token.
 */
export const getAccessToken = async (scope: string): Promise<string> => {
    console.log(`Acquiring token for scope: ${scope}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const token = MOCK_TOKEN + tokenCounter++;
            console.log(`Acquired token: ${token}`);
            resolve(token);
        }, 300);
    });
};

/**
 * Simulates clearing the token cache on sign-out.
 */
export const clearTokenCache = () => {
    console.log('Token cache cleared.');
    tokenCounter = 0;
};
