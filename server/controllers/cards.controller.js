import path from 'path';
import { fileURLToPath } from 'url';
import { loadJSON } from '../utils/jsonStore.js';
import { decodeToken, encodeToken } from '../utils/tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsPath = path.join(__dirname, '..', 'mock_data', 'cards.json');

export const listCards = (req, res, next) => {
  try {
    let cards = loadJSON(cardsPath);

    const max = Math.min(Math.max(parseInt(req.query.max) || 50, 1), 100);
    const sortParam = req.query.sort;
    const cardIds = req.query.cardIds;
    const nextPageToken = req.query.nextPage || null;
    const prevPageToken = req.query.prevPage || null;

    if (cardIds) {
      const ids = cardIds.split(',').map(id => id.trim());
      cards = cards.filter(card => ids.includes(card.uuid));
    }

    if (sortParam) {
      const [field, order] = sortParam.split(':');
      cards.sort((a, b) => {
        if (a[field] === undefined) return 1;
        if (b[field] === undefined) return -1;
        if (typeof a[field] === 'string') {
          return order === 'desc'
            ? b[field].localeCompare(a[field])
            : a[field].localeCompare(b[field]);
        }
        return order === 'desc' ? b[field] - a[field] : a[field] - b[field];
      });
    }

    let startIndex = 0;
    if (nextPageToken) {
      const decodedId = decodeToken(nextPageToken);
      startIndex = cards.findIndex(c => c.uuid === decodedId) + 1;
      if (startIndex < 0) startIndex = 0;
    } else if (prevPageToken) {
      const decodedId = decodeToken(prevPageToken);
      startIndex = cards.findIndex(c => c.uuid === decodedId) - max;
      if (startIndex < 0) startIndex = 0;
    }

    const pagedCards = cards.slice(startIndex, startIndex + max);
    const lastCard = pagedCards[pagedCards.length - 1];
    const firstCard = pagedCards[0];

    const nextPage = (startIndex + max) < cards.length && lastCard ? encodeToken(lastCard.uuid) : null;
    const prevPage = startIndex > 0 && firstCard ? encodeToken(firstCard.uuid) : null;

    res.json({ nextPage, prevPage, results: pagedCards });
  } catch (err) {
    next(err);
  }
};
