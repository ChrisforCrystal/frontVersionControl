# Quickstart: Frontend Version Control

## 1. Prerequisites

Ensure you have Node.js 20+ installed.

```bash
npm install -g pnpm
```

## 2. Setup

Bootstrap the monorepo:

```bash
pnpm install
```

## 3. Development Workflow

### Step 1: Start Backend (Runtime)

Start the Node.js server which serves the page.

```bash
cd apps/backend
pnpm dev
# Server running at http://localhost:3000
```

### Step 2: Build & Publish Frontend (v1.0.0)

Simulate a release of version 1.0.0.

```bash
cd apps/frontend
# Build and copy artifacts to root/artifacts/v1.0.0
pnpm publish:v1
```

### Step 3: Verify v1.0.0

Visit `http://localhost:3000`. You should see the v1.0.0 app.

### Step 4: Release v1.0.1

Make a change in `apps/frontend/src/App.tsx`, then release v1.0.1.

```bash
pnpm publish:v2
```

### Step 5: Switch Version

Call the admin API to switch to v1.0.1 without restarting the server.

```bash
curl -X POST http://localhost:3000/api/admin/version \
  -H "Content-Type: application/json" \
  -d '{"version": "v1.0.1"}'
```

Refresh the browser. You should see the v1.0.1 changes immediately.
