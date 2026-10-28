# Amoeba

A JavaScript microservices lab for learning rate limiting through an animated amoeba. See [INTENT.md](INTENT.md) for the learning goals and intended behavior.

This repository currently contains a runnable scaffold. Rate limiting, feeding, animation, and live events are left for implementation.

## Getting started

Use Node.js 24 or newer and npm. If you use nvm, run `nvm use` first.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Stop all processes with Ctrl+C.

| Workspace | Directory | Default address |
| --- | --- | --- |
| Browser client | `apps/web` | http://127.0.0.1:5173 |
| Feeding gateway | `services/gateway` | http://127.0.0.1:3001 |
| Rate limiter | `services/rate-limiter` | http://127.0.0.1:3002 |
| Amoeba service | `services/amoeba` | http://127.0.0.1:3003 |

Run any component independently with `npm run dev:web`, `npm run dev:gateway`, `npm run dev:limiter`, or `npm run dev:amoeba` from the repository root.

## Configuration

Defaults work without environment files. To customize a component, copy its `.env.example` to `.env` in that same directory and edit it. Restart the component after changing configuration.

The browser development server proxies `/api` requests to the gateway, avoiding a separate browser CORS setup. Its `GATEWAY_URL` configures that proxy. The gateway's `RATE_LIMITER_URL` and `AMOEBA_URL` are reserved for the service calls you will implement. If you change a service port, update its callers' URLs too.

## Scaffold routes

These paths are initial conventions; request and response contracts remain open for design.

| Service | Route | Current behavior |
| --- | --- | --- |
| All backend services | `GET /health` | `200` liveness response; no dependency checks |
| Gateway | `POST /api/feed` | `501 NOT_IMPLEMENTED` |
| Rate limiter | `POST /admissions` | `501 NOT_IMPLEMENTED` |
| Amoeba | `POST /feeds` | `501 NOT_IMPLEMENTED` |

```sh
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3002/health
curl http://127.0.0.1:3003/health
curl -i -X POST http://127.0.0.1:3001/api/feed
```

Each service separates Express setup (`src/app.js`) from listening on a port (`src/server.js`). Put behavior in modules as you implement it, keeping HTTP handlers small. The browser entry point is `apps/web/src/main.js`.

## Suggested implementation order

1. Write a token-bucket module in the rate-limiter service with an injectable clock. Start with capacity 5 and refill rate 1 token per second.
2. Add deterministic tests for the acceptance criteria in `INTENT.md`, then connect the module to `POST /admissions`.
3. Implement feed acceptance and state in the amoeba service.
4. Connect the gateway to both services, including `429`, `Retry-After`, and distinct downstream-error handling.
5. Connect browser controls and the request timeline to the real API.
6. Define the SSE event contract, then add live updates and Canvas animation.

SSE routing, request correlation, configuration/reset semantics, and downstream failure policy remain explicit design tasks. No simulated success or limiter algorithm is included in this scaffold.

## Checks

```sh
npm test
npm run build
```

`npm test` runs Node's built-in test runner in each backend workspace. There are no tests yet; add `*.test.js` files as you implement behavior. `npm run build` builds the browser client into `apps/web/dist`.

The development proxy is not included in the static build. Production hosting and API routing are outside the current scaffold.
