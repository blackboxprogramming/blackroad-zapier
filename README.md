[![npm version](https://img.shields.io/npm/v/blackroad-zapier.svg)](https://www.npmjs.com/package/blackroad-zapier)
[![npm downloads](https://img.shields.io/npm/dm/blackroad-zapier.svg)](https://www.npmjs.com/package/blackroad-zapier)
[![Node.js Version](https://img.shields.io/node/v/blackroad-zapier.svg)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/blackboxprogramming/blackroad-zapier.svg?style=social&label=Star)](https://github.com/blackboxprogramming/blackroad-zapier)
[![GitHub forks](https://img.shields.io/github/forks/blackboxprogramming/blackroad-zapier.svg?style=social&label=Fork)](https://github.com/blackboxprogramming/blackroad-zapier/fork)

---

# BlackRoad Zapier Integration 🔌

> **Official Zapier integration for [BlackRoad OS](https://blackroad.io)** — connect BlackRoad deployments, analytics, and Stripe billing to 5,000+ apps without writing a single line of code.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
   - [npm (Recommended)](#npm-recommended)
   - [Zapier Platform CLI](#zapier-platform-cli)
4. [Authentication](#authentication)
5. [Stripe Integration](#stripe-integration)
6. [Triggers](#triggers)
   - [New Deployment Created](#new-deployment-created)
   - [Deployment Completed](#deployment-completed)
   - [Analytics Threshold Reached](#analytics-threshold-reached)
7. [Actions](#actions)
   - [Create Deployment](#create-deployment)
   - [Track Event](#track-event)
8. [Searches](#searches)
   - [Find Deployment by ID](#find-deployment-by-id)
9. [End-to-End Testing](#end-to-end-testing)
10. [Deployment Guide](#deployment-guide)
11. [API Reference](#api-reference)
12. [Support](#support)
13. [License & Copyright](#license--copyright)

---

## Overview

**BlackRoad Zapier Integration** bridges the [BlackRoad OS](https://blackroad.io) platform with the entire Zapier ecosystem. Automate your deployment pipelines, react to analytics alerts, process Stripe payments, and push data to any third-party tool — all through Zapier's no-code editor.

| Category   | Capability                            |
|------------|---------------------------------------|
| Triggers   | New Deployment, Deployment Completed, Analytics Threshold |
| Actions    | Create Deployment, Track Event        |
| Searches   | Find Deployment by ID                 |
| Auth       | Bearer API Key (BlackRoad API)        |
| Payments   | Stripe Billing & Subscription events  |

---

## Prerequisites

| Requirement | Version / Details |
|-------------|-------------------|
| Node.js     | `>= 18.0.0`       |
| npm         | `>= 9.0.0`        |
| Zapier CLI  | `>= 15.0.0`       |
| BlackRoad API Key | [Get yours →](https://blackroad.io/settings/api-keys) |
| Stripe Account *(optional)* | [stripe.com](https://stripe.com) |

---

## Installation

### npm (Recommended)

```bash
npm install blackroad-zapier
```

### Zapier Platform CLI

```bash
# Install Zapier CLI globally
npm install -g zapier-platform-cli

# Authenticate with Zapier
zapier login

# Clone and bootstrap this integration
git clone https://github.com/blackboxprogramming/blackroad-zapier.git
cd blackroad-zapier
npm install

# Validate the integration
zapier validate

# Run tests
npm test
```

---

## Authentication

BlackRoad uses **Bearer API Key** authentication.

1. Log in to your BlackRoad dashboard at [blackroad.io](https://blackroad.io).
2. Navigate to **Settings → API Keys**.
3. Generate a new API key and copy it.
4. In your Zapier integration settings, paste the key into the **API Key** field.

All API requests are authenticated via the `Authorization: Bearer <apiKey>` header against:

```
GET https://api.blackroad.io/v1/auth/verify
```

---

## Stripe Integration

BlackRoad supports Stripe for billing and subscription management. Use Zapier to connect Stripe events directly to BlackRoad workflows.

### Supported Stripe → BlackRoad Flows

| Stripe Event                  | BlackRoad Action                         |
|-------------------------------|------------------------------------------|
| `payment_intent.succeeded`    | Track payment event in BlackRoad analytics |
| `customer.subscription.created` | Create a new deployment environment    |
| `customer.subscription.deleted` | Trigger teardown/cleanup deployment    |
| `invoice.payment_failed`      | Fire analytics alert                     |

### Setting Up Stripe in Zapier

1. In Zapier, create a new Zap.
2. Select **Stripe** as the trigger app and choose the desired event (e.g., *Payment Intent Succeeded*).
3. Select **BlackRoad** as the action app.
4. Map Stripe fields (amount, customer ID, plan) to the BlackRoad **Track Event** or **Create Deployment** action fields.
5. Turn on the Zap.

### Stripe Webhook (Direct Integration)

For real-time events, configure a Stripe webhook pointing to your BlackRoad endpoint:

```
POST https://api.blackroad.io/v1/webhooks/stripe
```

Include your BlackRoad API key in the `Authorization` header when registering the endpoint in the [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks).

---

## Triggers

### New Deployment Created

Fires when a new deployment is created in BlackRoad.

| Field       | Value                                       |
|-------------|---------------------------------------------|
| **Key**     | `deployment_created`                        |
| **Endpoint**| `GET https://api.blackroad.io/v1/deployments` |

**Sample Payload:**
```json
{
  "id": "dep_abc123",
  "name": "my-app",
  "status": "created",
  "environment": "production",
  "created_at": "2026-01-15T10:00:00Z"
}
```

---

### Deployment Completed

Fires when a deployment finishes successfully.

| Field       | Value                                                          |
|-------------|----------------------------------------------------------------|
| **Key**     | `deployment_completed`                                         |
| **Endpoint**| `GET https://api.blackroad.io/v1/deployments?status=completed` |

**Sample Payload:**
```json
{
  "id": "dep_abc123",
  "name": "my-app",
  "status": "completed",
  "duration_ms": 45200,
  "completed_at": "2026-01-15T10:00:45Z"
}
```

---

### Analytics Threshold Reached

Fires when a configured analytics metric crosses a defined threshold.

| Field       | Value                                               |
|-------------|-----------------------------------------------------|
| **Key**     | `analytics_threshold`                               |
| **Endpoint**| `GET https://api.blackroad.io/v1/analytics/alerts`  |

**Sample Payload:**
```json
{
  "id": "alert_xyz789",
  "metric": "error_rate",
  "threshold": 5.0,
  "current_value": 6.3,
  "triggered_at": "2026-01-15T10:05:00Z"
}
```

---

## Actions

### Create Deployment

Creates a new deployment in your BlackRoad account.

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| **Key**     | `create_deployment`                           |
| **Endpoint**| `POST https://api.blackroad.io/v1/deployments` |

**Input Fields:**

| Field         | Type   | Required | Description                                |
|---------------|--------|----------|--------------------------------------------|
| `name`        | string | ✅ Yes   | Name for your deployment                   |
| `source`      | string | No       | GitHub repo URL or other source            |
| `environment` | string | No       | `production` (default), `staging`, `development` |

---

### Track Event

Sends an analytics event to BlackRoad.

| Field       | Value                                               |
|-------------|-----------------------------------------------------|
| **Key**     | `track_event`                                       |
| **Endpoint**| `POST https://api.blackroad.io/v1/analytics/events` |

**Input Fields:**

| Field        | Type   | Required | Description                  |
|--------------|--------|----------|------------------------------|
| `event`      | string | ✅ Yes   | Name of the event to track   |
| `properties` | text   | No       | JSON string of event metadata |

---

## Searches

### Find Deployment by ID

Retrieves a deployment by its unique ID.

| Field       | Value                                                         |
|-------------|---------------------------------------------------------------|
| **Key**     | `find_deployment`                                             |
| **Endpoint**| `GET https://api.blackroad.io/v1/deployments/:id`             |

**Input Fields:**

| Field | Type   | Required | Description          |
|-------|--------|----------|----------------------|
| `id`  | string | ✅ Yes   | The deployment's ID  |

---

## End-to-End Testing

Full E2E test coverage is required before any production deployment.

### Running Tests

```bash
# Install dependencies
npm install

# Run unit and integration tests
npm test
# or
zapier test

# Validate the integration schema
zapier validate
```

### E2E Test Checklist

Before pushing to production, verify:

- [ ] Authentication test passes (`GET /v1/auth/verify` returns `200 OK`)
- [ ] **Trigger** — New Deployment Created: poll returns valid deployment array
- [ ] **Trigger** — Deployment Completed: poll returns completed deployments only
- [ ] **Trigger** — Analytics Threshold Reached: poll returns active alerts
- [ ] **Action** — Create Deployment: POST creates a deployment and returns a valid ID
- [ ] **Action** — Track Event: POST sends event and returns `200 OK`
- [ ] **Search** — Find Deployment by ID: GET returns the correct deployment object
- [ ] **Stripe** — Payment Intent Succeeded → Track Event: Zap fires correctly end-to-end
- [ ] **Stripe** — Subscription Created → Create Deployment: Zap fires correctly end-to-end
- [ ] All API error responses are handled gracefully (4xx, 5xx)

---

## Deployment Guide

```bash
# 1. Ensure all tests pass
npm test

# 2. Validate schema
zapier validate

# 3. Push to Zapier (staging)
zapier push

# 4. Promote to production in Zapier Developer Platform
zapier promote <version>
```

> **Note:** Only promote after all E2E tests pass and the integration has been reviewed in the [Zapier Partner Portal](https://zapier.com/developer).

---

## API Reference

Base URL: `https://api.blackroad.io/v1`

| Method | Endpoint                       | Description                  |
|--------|--------------------------------|------------------------------|
| GET    | `/auth/verify`                 | Verify API key                |
| GET    | `/deployments`                 | List all deployments          |
| POST   | `/deployments`                 | Create a deployment           |
| GET    | `/deployments/:id`             | Get deployment by ID          |
| GET    | `/deployments?status=completed`| List completed deployments    |
| POST   | `/analytics/events`            | Track an analytics event      |
| GET    | `/analytics/alerts`            | List analytics threshold alerts |
| POST   | `/webhooks/stripe`             | Stripe webhook receiver       |

Full REST API documentation: [https://docs.blackroad.io/api](https://docs.blackroad.io/api)

---

## Support

| Channel  | Link |
|----------|------|
| Email    | [blackroad.systems@gmail.com](mailto:blackroad.systems@gmail.com) |
| Issues   | [GitHub Issues](https://github.com/blackboxprogramming/blackroad-zapier/issues) |
| Zapier Docs | [Zapier Platform Docs](https://platform.zapier.com/docs) |
| Stripe Docs | [Stripe Developer Docs](https://stripe.com/docs) |

---

## License & Copyright

**Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.**

**CEO:** Alexa Amundson

**PROPRIETARY AND CONFIDENTIAL** — This software is the proprietary property of BlackRoad OS, Inc.

### Usage Restrictions

| Use Case | Permitted |
|----------|-----------|
| Testing and evaluation | ✅ Yes |
| Educational purposes | ✅ Yes |
| Commercial use / resale | ❌ No |
| Redistribution without written permission | ❌ No |

For commercial licensing inquiries, contact **[blackroad.systems@gmail.com](mailto:blackroad.systems@gmail.com)**.

See [LICENSE](LICENSE) for complete terms.

---

Part of the **BlackRoad Empire** 🚀 | [blackroad.io](https://blackroad.io)
