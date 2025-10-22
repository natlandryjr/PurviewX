
/**
 * Triggers a browser download for a JSON object.
 * @param data The JSON object to export.
 * @param filename The desired name for the downloaded file.
 */
export const exportAsJson = (data: object, filename = 'export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Converts an array of objects to a CSV string.
 * @param data Array of objects.
 * @returns CSV string.
 */
const arrayToCsv = (data: Record<string, any>[]): string => {
  if (!data || data.length === 0) {
    return '';
  }
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};


/**
 * Triggers a browser download for an array of objects as a CSV file.
 * @param data The array of objects to export.
 * @param filename The desired name for the downloaded file.
 */
export const exportAsCsv = (data: Record<string, any>[], filename = 'export.csv') => {
  const csvString = arrayToCsv(data);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
