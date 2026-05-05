import express from 'express';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireHeader } from './middleware/requireHeader.js';

const app = express();

app.use(express.json());
app.use(requireHeader);

app.use('/', routes);
app.use(errorHandler);

export default app;
