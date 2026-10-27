import express from 'express';
import { createApiRouter } from '../server/apiApp.js';

const app = express();
app.use('/api', createApiRouter());

export default app;
