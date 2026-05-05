import fs from 'fs';

export function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    const err = new Error(`Failed to load JSON from ${filePath}`);
    err.status = 500;
    err.reason = 'Not found file path';
    err.severity = 'ERROR';
    err.category = 'SERVER';
    err.description = error.message || err.message;
    throw err;
  }
}

export function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    const err = new Error(`Failed to save JSON to ${filePath}`);
    err.status = 500;
    err.reason = 'Not found file path';
    err.severity = 'ERROR';
    err.category = 'SERVER';
    err.description = error.message || err.message;
    throw err;
  }
}
