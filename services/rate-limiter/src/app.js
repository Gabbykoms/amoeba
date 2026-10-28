import express from 'express';

export const app = express();
app.use(express.json());

// Liveness only: this does not check downstream services.
app.get('/health', (_request, response) => {
  response.json({ service: 'rate-limiter', status: 'ok' });
});

app.post('/admissions', (_request, response) => {
  // TODO: Implement token-bucket admission decisions.
  response.status(501).json({
    error: 'NOT_IMPLEMENTED',
    message: 'Implement token-bucket admission decisions.',
  });
});
