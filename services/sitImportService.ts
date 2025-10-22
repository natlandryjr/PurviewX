import type { CustomSit } from '../types';

/**
 * A simplified mock parser for Microsoft Purview SIT XML files.
 * In a real application, this would use a proper XML parsing library (like DOMParser in the browser)
 * and would have more robust error handling.
 *
 * @param xmlContent The string content of the SIT XML file.
 * @returns A promise that resolves to a CustomSit object.
 * @throws An error if the XML is malformed or missing required fields.
 */
export const parseSitXml = (xmlContent: string): Promise<CustomSit> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
        // Basic validation
        if (!xmlContent.includes('<RulePack') || !xmlContent.includes('<Entity')) {
            throw new Error('Invalid SIT format. Missing <RulePack> or <Entity> tag.');
        }

        // Mock extraction using regex - THIS IS NOT ROBUST for real XML parsing.
        const idMatch = xmlContent.match(/<Entity id="([^"]+)"/);
        const nameMatch = xmlContent.match(/<Name default="true" langcode="en-us">([^<]+)<\/Name>/);
        const descMatch = xmlContent.match(/<Description default="true" langcode="en-us">([^<]+)<\/Description>/);

        if (!idMatch || !nameMatch || !descMatch) {
            throw new Error('Could not find required fields (Entity ID, Name, Description) in the XML.');
        }

        const id = idMatch[1];
        const name = nameMatch[1];
        const description = descMatch[1];

        const newSit: CustomSit = {
            id: id,
            name: name,
            description: description,
            // Mocked values for other properties
            keywords: ['mock-keyword-1', 'mock-keyword-2'],
            confidence: 75,
            xmlContent: xmlContent,
        };
        resolve(newSit);

        } catch (error) {
            reject(error);
        }
    }, 500);
  });
};
