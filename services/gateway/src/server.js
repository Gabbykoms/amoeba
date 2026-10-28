import { app } from './app.js';

const port = Number(process.env.GATEWAY_PORT ?? 3001);
const server = app.listen(port, '127.0.0.1', () => {
  console.log('gateway listening at http://127.0.0.1:' + port);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
