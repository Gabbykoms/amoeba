# Amoeba project intent

## Purpose

Build a JavaScript microservices learning lab around an animated amoeba. The primary goal is to understand rate limiting through implementation, experiments, and observable results. A secondary goal is to refresh JavaScript skills across backend services and a browser client.

Sending a request is feeding the amoeba. An allowed request delivers food; a rate-limited request is rejected. Between requests, the amoeba drifts through its environment and gently changes shape.

This document records the agreed direction before implementation. Update it as deliberate design decisions change.

## Learning principles

- Make every admission decision explainable through actual service results and visible limiter state.
- Support both an approachable browser playground and a real API callable with curl or scripts.
- Implement the first rate-limiting algorithm ourselves to understand its mechanics.
- Introduce distributed-system complexity progressively, when it answers a specific learning question.
- Keep admission separate from processing: permission to eat is rate limiting; digestion represents work after admission.
- Keep biological state separate from policy. Hunger, size, and digestion must not silently alter rate limits.

## Initial technology choices

| Area | Choice |
| --- | --- |
| Language | Plain JavaScript with ES modules; JSDoc where useful |
| Backend | Node.js and Express |
| Browser tooling | Vite and plain JavaScript |
| Animation | Canvas 2D |
| Live updates | Server-Sent Events (SSE) |
| Tests | Node.js built-in test runner |
| Repository | One repository containing three independently running services and the browser client |

The first milestone does not require a database, message broker, frontend framework, or TypeScript. Shared state will be introduced when exploring multiple service instances.

## Service responsibilities

### Feeding gateway

Expose the public feeding API. Ask the rate limiter for an admission decision before forwarding an allowed feed to the amoeba service. Return `429 Too Many Requests` and `Retry-After` when the allowance is exhausted. Return a successful result only after the amoeba service accepts the feed.

### Rate limiter

Own the admission policy and allowance. Begin with an in-memory token bucket. Return the decision and enough state to explain it, including remaining capacity and the wait until another request can be admitted.

### Amoeba service

Accept allowed feeds and own the amoeba's application state. Keep acceptance distinct from any later simulation of digestion or processing.

### Browser client

Render the environment, animate the amoeba, provide experiment controls, and display service outcomes. Animate idle movement locally so smooth motion does not depend on backend updates. Use SSE for live feeding outcomes, including requests made outside the browser. The exact event endpoint and routing will be decided during implementation.

```text
Browser or curl
       |
       v
Feeding gateway ---- admission check ----> Rate limiter
       |
       +-- Allowed ----> Amoeba service accepts food
       |
       +-- Rejected ---> 429 + Retry-After
```

## First milestone: one amoeba and a token bucket

Start with a bucket that is initially full, holds five tokens, replenishes at one token per second, and charges one token per feed. Replenishment is based on elapsed time, capped at bucket capacity; admission requires at least one full token. Expose these settings in the experiment controls.

Provide:

- One amoeba drifting and gently changing shape in an environment.
- A real feeding API passing through the gateway, limiter, and amoeba service.
- Single-feed, burst, and sustained-request controls.
- Food particles that are engulfed on successful acceptance and bounce away on rate-limit rejection.
- Visible available tokens, accepted and rejected counts, request rate, and time until capacity permits another feed.
- A request timeline with the HTTP outcome and a concrete explanation for each admission decision.
- Live visualization of feeds initiated through either the browser or an external API client.

Visual feedback must follow actual outcomes. A service failure must be distinguishable from rate-limit rejection. The timeline provides technical precision alongside the animation.

### Verification and completion criteria

- With a fresh bucket and no elapsed time, five requests are admitted and the sixth is rejected.
- After one second, an exhausted bucket permits one more request.
- Idle time never replenishes beyond the five-token capacity.
- Rejected requests do not reach the amoeba service or consume tokens.
- Concurrent requests cannot spend the same allowance twice within the initial limiter process.
- Rate-limit rejection returns `429` with an appropriate `Retry-After` value.
- Browser controls and curl requests produce visible, explainable outcomes.
- Limiter tests use a controllable clock so time-dependent behavior is deterministic.
- Local setup and example requests are documented when implementation is added.

## Learning progression after the first milestone

1. **Compare algorithms.** Apply identical traffic patterns to fixed windows, sliding windows, and token buckets. Investigate boundary bursts and the differences between burst allowance and sustained rate.
2. **Introduce multiple feeders.** Give clients identities and differently colored food. Compare per-client limits with a shared global limit.
3. **Run multiple instances.** Demonstrate how independent in-memory limiter state can multiply the effective allowance. Introduce shared state and atomic updates to enforce a coordinated limit.
4. **Explore failures and retries.** Examine limiter unavailability, fail-open versus fail-closed behavior, clients ignoring `Retry-After`, and synchronized retries.
5. **Expand the lab.** Use digestion and processing to explore queues, backpressure, and timeouts once the rate-limiting foundation is understood.

These are staged learning objectives, not requirements to implement all at once. Rate limiting remains the first priority.

## Decisions to resolve during implementation

- API paths, payloads, and event schemas.
- SSE ownership and delivery of outcomes from all feeding clients.
- Request correlation between API results, timeline entries, and animations.
- Reset behavior and how configuration changes affect an active experiment.
- Failure reporting when admission succeeds but downstream feed processing fails, including whether the spent token is retained.

Resolve these explicitly as needed and document the resulting behavior. Avoid adding infrastructure before an experiment needs it.
