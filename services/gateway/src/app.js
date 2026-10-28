import express from 'express';

export const app = express();
app.use(express.json());

// Liveness only: this does not check downstream services.
app.get('/health', (_request, response) => {
  response.json({ service: 'gateway', status: 'ok' });
});

app.post('/api/feed', (_request, response) => {
  // TODO: Coordinate admission and feed acceptance.
  response.status(501).json({
    error: 'NOT_IMPLEMENTED',
    message: 'Coordinate admission and feed acceptance.',
  });
});
