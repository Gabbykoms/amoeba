import { app } from './app.js';

const port = Number(process.env.AMOEBA_PORT ?? 3003);
const server = app.listen(port, '127.0.0.1', () => {
  console.log('amoeba listening at http://127.0.0.1:' + port);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
