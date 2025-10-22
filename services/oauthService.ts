/**
 * Simulates a user going through the OAuth admin consent flow for a specific set of scopes.
 * This function uses timeouts to mimic the real-world delays of user interaction and network requests.
 *
 * @param scopes - An array of permission scopes to request consent for.
 * @returns A promise that resolves with `{ success: true }` upon successful simulation.
 */
export const simulateAdminConsent = (scopes: string[]): Promise<{ success: true }> => {
  console.log(`OAuth Flow: Initiating admin consent for scopes:`, scopes);
  
  // 1. Simulate the time it takes for the user to be redirected, review permissions, and grant consent.
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`OAuth Flow: User consent granted for scopes:`, scopes);
      
      // 2. Simulate exchanging the received authorization code for an access token
      //    and making a trivial API call to verify the connection works.
      setTimeout(() => {
        console.log('OAuth Flow: Trivial API call successful. Connection verified.');
        resolve({ success: true });
      }, 750);
      
    }, 2000);
  });
};
