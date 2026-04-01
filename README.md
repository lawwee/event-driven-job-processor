# Event-Driven Job Processor

A production-grade asynchronous job processing engine built with Node.js, TypeScript, BullMQ, Redis, and MongoDB. Designed to demonstrate distributed systems patterns used in payment platforms, logistics systems, and SaaS infrastructure.

---

## Architecture

Jobs flow through the system in one direction:

```
Client
  │
  ▼
REST API  ──────────────────────────────────► MongoDB
  │                                         (persisted at every state transition)
  ▼
Job Producer
  │  calculates delay, enqueues with retry + backoff config
  ▼
BullMQ Queue (Redis)
  │  delayed or immediate
  ▼
Job Worker
  │  consumes jobs, owns all lifecycle transitions via BullMQ events
  ▼
Job Executor
  │  resolves handler from registry
  ▼
Job Handler
   pure business logic, no lifecycle awareness
```

---

## Job Lifecycle

Every state transition is driven by a BullMQ worker event and persisted to MongoDB.

```
PENDING
  │
  └──► QUEUED         (enqueued by producer — immediate or delayed)
         │
         └──► PROCESSING    (worker picks up the job)
                │
                ├──► SUCCESS      (handler completed without error)
                │
                ├──► FAILED       (handler threw — retries still remaining, or exhausted)
                │
                └──► DEAD         (worker crashed mid-execution — stalled event)
```

| Status | Trigger |
|---|---|
| `PENDING` | Job created via API |
| `QUEUED` | Producer enqueues to BullMQ |
| `PROCESSING` | Worker begins execution |
| `SUCCESS` | BullMQ `completed` event |
| `FAILED` | BullMQ `failed` event — error thrown by handler |
| `DEAD` | BullMQ `stalled` event — worker process crashed mid-execution |

> `FAILED` and `DEAD` are intentionally distinct. `FAILED` means the handler threw a known error and retries were exhausted. `DEAD` means the worker process died during execution — the job's actual outcome is unknown.

---

## Design Decisions

**Why BullMQ over a simple queue or setTimeout?**
BullMQ provides durable, Redis-backed queues with built-in retry scheduling, exponential backoff, concurrency control, delayed jobs, and worker lifecycle events.

**Why does lifecycle ownership live in worker events, not the handler?**
Handlers are pure business logic. They execute, return on success, or throw on failure — nothing else. Lifecycle transitions (`PROCESSING`, `SUCCESS`, `FAILED`, `DEAD`) are managed exclusively in BullMQ worker event callbacks. This means a handler failure always propagates through BullMQ's retry machinery before any final state is written to MongoDB.

**Why exponential backoff?**
Transient failures (network timeouts, service hiccups) should not immediately exhaust retries. Exponential backoff gives dependent systems time to recover between attempts.

**Why an idempotency guard before execution?**
BullMQ can redeliver a stalled job that actually completed before the worker crashed. The guard checks for terminal states (`SUCCESS`, `DEAD`) before touching the job, preventing duplicate execution.

**Why store `lastError` and `retryCount` on the job document?**
MongoDB is the source of truth for job state. Storing failure metadata alongside the job makes dead-letter analysis possible without querying Redis — useful for dashboards, alerting, and post-mortems.

---

## Tech Stack

| Tool | Role |
|---|---|
| Node.js + TypeScript | Runtime and type safety |
| BullMQ | Queue, worker, retry, and scheduling engine |
| Redis (Docker) | BullMQ backend — durable job storage |
| MongoDB + Mongoose | Job persistence and state tracking |
| Docker Compose | Redis container orchestration |

---

## Project Structure

```
src/
├── config/          # Configuration files
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── model/           # Mongoose job schema
├── interfaces/      # TypeScript interfaces and enums
├── jobs/
│   ├── handlers/    # One handler per job type (pure business logic)
│   └── job.registry.ts  # Maps job types to handler instances
└── queue/
    ├── job.queue.ts
    ├── job.producer.ts   # Enqueues jobs with delay + retry config
    ├── job.executor.ts   # Resolves and calls the correct handler
    └── job.worker.ts     # Worker + BullMQ lifecycle event handling
```

---

## Running Locally

**Prerequisites:** Node.js, Docker

```bash
# 1. Start Redis
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Fill in MONGODB_URI, REDIS_HOST, REDIS_PORT

# 4. Start the API server
npm run dev

# 5. Start the worker process (separate terminal)
npm run start:worker
```

---

## API Reference

### Create a Job

```
POST /api/jobs
```

```json
{
  "name": "Welcome Email",
  "jobType": "SEND_EMAIL",
  "scheduledAt": "2025-01-15T10:00:00.000Z",
  "payload": {
    "to": "user@example.com",
    "subject": "Welcome",
    "body": "Thanks for signing up."
  }
}
```

**Response**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Welcome Email",
  "jobType": "SEND_EMAIL",
  "status": "QUEUED",
  "scheduledAt": 1705312800000,
  "retryCount": 0,
  "createdAt": "2025-01-15T09:00:00.000Z"
}
```

---

### Get a Job

```
GET /api/jobs/:id
```

---

### Get All Jobs

```
GET /api/jobs?status=FAILED
```

`status` is optional. When provided, filters by job status (`PENDING`, `QUEUED`, `PROCESSING`, `SUCCESS`, `FAILED`, `DEAD`).

---

## Retry Policy

| Setting | Value |
|---|---|
| Max attempts | 5 |
| Backoff strategy | Exponential |
| Initial backoff delay | 2 seconds |
| Concurrency | 5 workers |

Retry attempts and final error message are persisted to MongoDB on each failure for observability.
