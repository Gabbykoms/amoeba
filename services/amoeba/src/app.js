import express from 'express';

export const app = express();
app.use(express.json());

// Liveness only: this does not check downstream services.
app.get('/health', (_request, response) => {
  response.json({ service: 'amoeba', status: 'ok' });
});

app.post('/feeds', (_request, response) => {
  // TODO: Accept admitted feeds and update amoeba state.
  response.status(501).json({
    error: 'NOT_IMPLEMENTED',
    message: 'Accept admitted feeds and update amoeba state.',
  });
});
