import type { WizardData, EvidenceBinder } from '../types';

// Simple non-crypto hash function for demonstration.
// Sorting keys ensures a consistent hash for the same data regardless of key order.
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return '0x' + Math.abs(hash).toString(16);
};

export const generateChecksum = (data: WizardData): string => {
  const dataString = JSON.stringify(data, Object.keys(data).sort());
  return simpleHash(dataString);
};

export const generateEvidenceBinder = (data: WizardData, version: number): Promise<EvidenceBinder> => {
  return new Promise(resolve => {
    // Simulate the time it takes to gather evidence and package it.
    setTimeout(() => {
      const binder: EvidenceBinder = {
        version,
        timestamp: new Date().toISOString(),
        checksum: generateChecksum(data),
        data: data,
      };
      resolve(binder);
    }, 2500);
  });
};

const generateHtmlSection = (title: string, content: string): string => `
  <div class="mb-8">
    <h2 class="text-xl font-semibold border-b pb-2 mb-4">${title}</h2>
    ${content}
  </div>
`;

const generateKeyValueDl = (data: Record<string, any>): string => `
  <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
    ${Object.entries(data)
      .map(([key, value]) => `
        <div class="border-b pb-2">
          <dt class="text-sm font-medium text-gray-500">${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</dt>
          <dd class="mt-1 text-sm text-gray-900 font-semibold">${typeof value === 'object' ? JSON.stringify(value) : value}</dd>
        </div>
      `).join('')}
  </dl>
`;

export const generateBinderHtml = (binder: EvidenceBinder): string => {
  const { data } = binder;
  const enabledRetentionCount = data.retentionPolicies.filter(p => p.isEnabled).length;
  const enabledDlpCount = data.dlpPolicies.filter(p => p.isEnabled).length;

  const auditSearches = data.auditSettings.isEnabled ? [
    { id: 'search-dlp-matches', name: 'DLP Policy Matches', schedule: 'Daily' },
    { id: 'search-label-changes', name: 'Sensitivity Label Changes', schedule: 'Daily' },
    { id: 'search-admin-actions', name: 'High-Privilege Admin Actions', schedule: 'Weekly' },
  ] : [];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PurviewX Evidence Binder v${binder.version}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 font-sans p-8">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <header class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800">PurviewX Evidence Binder</h1>
          <p class="text-gray-500">A snapshot of the deployed compliance configuration.</p>
        </header>

        ${generateHtmlSection('Binder Summary', `
          ${generateKeyValueDl({
            Version: `v${binder.version}`,
            GeneratedAt: new Date(binder.timestamp).toLocaleString(),
            ConfigurationChecksum: `<code class="text-sm bg-gray-200 p-1 rounded">${binder.checksum}</code>`
          })}
        `)}

        ${generateHtmlSection('Core Configuration', `
          ${generateKeyValueDl({
            'Cloud Environment': data.cloudEnvironment,
          })}
          <h3 class="text-lg font-medium mt-6 mb-2">Admin Consent Scopes</h3>
          <ul class="list-disc list-inside bg-gray-50 p-4 rounded-md">
            ${Object.keys(data.consents).map(scope => `<li class="text-sm"><code>${scope}</code></li>`).join('') || '<li class="text-sm text-gray-500">No scopes consented.</li>'}
          </ul>
        `)}

        ${generateHtmlSection('Data Classification', `
          <h3 class="text-lg font-medium mb-2">Custom Sensitive Information Types (${data.customSits.length})</h3>
          ${data.customSits.length > 0 ? `
            <ul class="list-disc list-inside bg-gray-50 p-4 rounded-md">
              ${data.customSits.map(sit => `<li class="text-sm"><b>${sit.name}</b>: ${sit.description}</li>`).join('')}
            </ul>
          ` : '<p class="text-sm text-gray-500">No custom SITs were imported.</p>'}

          <h3 class="text-lg font-medium mt-6 mb-2">Sensitivity Labels (${data.sensitivityLabels.length})</h3>
          <ul class="list-disc list-inside bg-gray-50 p-4 rounded-md">
            ${data.sensitivityLabels.sort((a,b) => b.priority - a.priority).map(label => `<li class="text-sm"><b>${label.name}</b> (Priority: ${label.priority})</li>`).join('')}
          </ul>
        `)}

        ${generateHtmlSection('Data Governance & Protection', `
          <h3 class="text-lg font-medium mb-2">Retention Policies (${enabledRetentionCount} enabled)</h3>
          ${enabledRetentionCount > 0 ? `
            <ul class="list-disc list-inside bg-gray-50 p-4 rounded-md">
              ${data.retentionPolicies.filter(p => p.isEnabled).map(policy => `<li class="text-sm"><b>${policy.name}</b> (${policy.durationDays === -1 ? 'Indefinite' : `${policy.durationDays} days`})</li>`).join('')}
            </ul>
          ` : '<p class="text-sm text-gray-500">No retention policies were enabled.</p>'}

          <h3 class="text-lg font-medium mt-6 mb-2">Data Loss Prevention Policies (${enabledDlpCount} enabled)</h3>
           ${enabledDlpCount > 0 ? `
            <ul class="list-disc list-inside bg-gray-50 p-4 rounded-md">
              ${data.dlpPolicies.filter(p => p.isEnabled).map(policy => `<li class="text-sm"><b>${policy.name}</b> (Locations: ${policy.locations.join(', ')})</li>`).join('')}
            </ul>
          ` : '<p class="text-sm text-gray-500">No DLP policies were enabled.</p>'}
        `)}

        ${generateHtmlSection('Audit & eDiscovery', `
           ${generateKeyValueDl({
            'Unified Auditing': data.auditSettings.isEnabled ? `Enabled (${data.auditSettings.retentionDays} day retention)` : 'Disabled',
            'Initial eDiscovery Case': data.eDiscoveryCase.create ? `Created (Name: ${data.eDiscoveryCase.name})` : 'Not Created'
          })}
          <h3 class="text-lg font-medium mt-6 mb-2">Scheduled Audit Searches</h3>
           ${auditSearches.length > 0 ? `
            <ul class="list-disc list-inside bg-gray-50 p-4 rounded-md">
              ${auditSearches.map(search => `<li class="text-sm"><b>${search.name}</b> (ID: <code>${search.id}</code>, Schedule: ${search.schedule})</li>`).join('')}
            </ul>
          ` : '<p class="text-sm text-gray-500">Auditing was not enabled, no searches scheduled.</p>'}
        `)}

        <footer class="text-center mt-10 pt-4 border-t">
          <p class="text-xs text-gray-500">Generated by PurviewX Configuration Accelerator</p>
        </footer>
      </div>
    </body>
    </html>
  `;
};
