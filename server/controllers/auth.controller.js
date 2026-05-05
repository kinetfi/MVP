import path from 'path';
import { fileURLToPath } from 'url';
import { loadJSON } from '../utils/jsonStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAuth = (req, res, next) => {
  try {
    const auth = loadJSON(path.join(__dirname, '..', 'mock_data', 'authResponse.json'));
    res.json(auth);
  } catch (err) {
    next(err);
  }
};
