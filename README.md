# Feature Flag System

## What This System Does

The Feature Flag System is a backend service and React admin UI for creating, managing, evaluating, and monitoring feature flags.

The system allows a team to:

- Create feature flags.
- Configure flags independently for different environments.
- Turn flags on or off per environment.
- Configure percentage-based rollouts.
- Target specific users.
- Evaluate flags for a specific user and environment.
- View the history of flag changes.
- Use an SDK to evaluate flags from an application.
- Fall back to a configured value when the evaluation service is unreachable.

The system uses a real PostgreSQL database and the admin UI communicates with the backend through the real API.

## Setup & Configuration

### Requirements

- Node.js
- npm
- PostgreSQL

### Project Structure

```text
feature-flag-system/
├── backend/
├── admin-ui/
└── sdk/
```

### Backend Environment Variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/feature_flag_system
PORT=4000
FEATURE_FLAG_ENVIRONMENTS=staging,production
```

`DATABASE_URL` is the PostgreSQL connection string.

`PORT` controls the backend HTTP port.

`FEATURE_FLAG_ENVIRONMENTS` defines the environments supported by the system. The current configuration uses:

- `staging`
- `production`

### Admin UI Environment Variables

Create a `.env` file inside `admin-ui/`:

```env
VITE_API_URL=http://localhost:4000
```

The `VITE_API_URL` value tells the React admin UI where the backend API is running.

## Running the Service

Open a terminal and start the backend:

```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

You can verify that the API is running with:

```bash
curl http://localhost:4000/flags
```

A successful response returns the available flags.

## Running the Admin UI

Open another terminal:

```bash
cd admin-ui
npm install
npm run dev
```

Vite will provide a local URL, normally:

```text
http://localhost:5173
```

The admin UI uses the backend API configured through `VITE_API_URL`.

The UI provides functionality for:

- Listing flags.
- Creating flags.
- Selecting environments.
- Enabling and disabling flags.
- Editing rollout percentages.
- Adding targeted users.
- Removing targeted users.
- Viewing flag history.

## Running Tests

### Backend Tests

From the backend directory:

```bash
cd backend
npm test
```

The backend test suite covers:

- Flag creation and retrieval.
- Evaluation order.
- Percentage rollouts.
- Targeting.
- Environment isolation.
- Flag history.
- Edge cases.

The test suite currently contains 34 passing tests across 6 test files.

### SDK Tests

From the SDK directory:

```bash
cd sdk
npm test
```

The SDK tests cover:

- The happy path.
- An unreachable evaluation service.
- API errors and fallback behavior.

The SDK test suite contains 3 tests.

## The Flag Model & Environments

A flag contains a unique key and a description.

Each flag can have a separate configuration for every supported environment.

The main flag model contains:

```text
Flag
├── id
├── key
├── description
└── createdAt
```

Each environment configuration contains:

```text
Flag Environment
├── id
├── flagId
├── environment
├── enabled
├── rolloutPercentage
└── createdAt
```

The current environments are:

- `staging`
- `production`

Environment configuration is independent. Changing a flag in `staging` does not change its configuration in `production`.

## Evaluating a Flag

A flag is evaluated using:

- The flag key.
- The user ID.
- The environment.

The evaluation endpoint follows this structure:

```text
GET /evaluate/:flagKey/:environment?userId=:userId
```

Example:

```bash
curl "http://localhost:4000/evaluate/checkout/staging?userId=user123"
```

A successful evaluation can return:

```json
{
  "flag": "checkout",
  "environment": "staging",
  "enabled": true,
  "reason": "ROLLOUT_MATCH"
}
```

The `reason` field explains why the evaluation produced the result.

Possible evaluation reasons include:

```text
INVALID_ENVIRONMENT
FLAG_NOT_FOUND
FLAG_ENVIRONMENT_NOT_CONFIGURED
FLAG_DISABLED
TARGET_MATCH
ROLLOUT_MATCH
ROLLOUT_EXCLUDED
```

## The Evaluation Order

The evaluation process follows a defined order.

### 1. Validate the Environment

If the environment is not configured, the flag evaluates to disabled with:

```text
INVALID_ENVIRONMENT
```

### 2. Find the Flag

If the flag does not exist, evaluation returns disabled with:

```text
FLAG_NOT_FOUND
```

### 3. Find the Environment Configuration

If the flag exists but has no configuration for the requested environment, evaluation returns disabled with:

```text
FLAG_ENVIRONMENT_NOT_CONFIGURED
```

### 4. Check Whether the Flag Is Disabled

If the flag is disabled for the environment, evaluation immediately returns:

```text
FLAG_DISABLED
```

### 5. Check User Targeting

If the user is explicitly targeted, the flag evaluates to enabled:

```text
TARGET_MATCH
```

### 6. Check the Rollout Percentage

A rollout of `0%` excludes users.

A rollout of `100%` includes users.

For percentages between `0` and `100`, the user's deterministic rollout bucket is checked.

### 7. Return the Rollout Result

If the user's bucket is inside the configured percentage:

```text
ROLLOUT_MATCH
```

Otherwise:

```text
ROLLOUT_EXCLUDED
```

The effective order is therefore:

```text
Environment
    ↓
Flag exists?
    ↓
Environment configured?
    ↓
Flag enabled?
    ↓
Targeted user?
    ↓
0% / 100% rollout?
    ↓
Percentage rollout hash
    ↓
Enabled / Disabled
```

## Percentage Rollouts & The Hash Strategy

Percentage rollouts use a deterministic SHA-256 hash.

The system hashes the combination of:

```text
userId:flagKey
```

The SHA-256 hash is converted to a number and reduced to a bucket from `0` to `99`.

The rollout percentage determines how many of those buckets are enabled.

For example, with a rollout of `25%`, users whose bucket is below `25` are included.

### Why the Flag Key Is Part of the Input

The flag key is included so that the same user can receive different rollout assignments for different flags.

For example:

```text
user123:checkout
user123:dark-mode
```

produce different hash inputs.

This prevents every feature flag from automatically selecting the same users at the same percentage.

### Why This Makes Rollouts Consistent

The hash is deterministic.

The same:

```text
userId + flagKey
```

always produces the same bucket.

Therefore, the same user receives the same rollout decision for a flag even after the service restarts.

Increasing the rollout percentage also retains users who were already included because their bucket does not change.

For example:

```text
25% → users with buckets 0-24
50% → users with buckets 0-49
```

Every user included at `25%` remains included at `50%`.

## User Targeting

Specific users can be targeted for a flag environment.

A target contains:

```text
flagEnvironmentId
userId
createdAt
```

Targeting is environment-specific.

For example, a user can be targeted in:

```text
staging
```

without being targeted in:

```text
production
```

The API supports adding, removing, and listing targeted users.

Example:

```bash
curl -X POST   http://localhost:4000/flags/checkout/staging/targets   -H "Content-Type: application/json"   -d '{"userId":"user123"}'
```

A targeted user receives the flag when the flag itself is enabled for that environment.

## Flag History

Flag changes are recorded in the flag history table.

A history entry contains:

```text
id
flagId
environment
actorId
changeType
beforeValue
afterValue
createdAt
```

History records allow the team to see:

- Who made the change.
- What environment was affected.
- What type of change occurred.
- The previous value.
- The new value.
- When the change occurred.

Examples of change types include:

```text
FLAG_CREATED
FLAG_TOGGLED
ROLLOUT_PERCENTAGE_CHANGED
TARGET_ADDED
TARGET_REMOVED
```

History entries are created when changes are made and are exposed through the history API.

The system does not provide an update operation for existing history records, making the recorded history effectively append-only through the application API.

## Using the SDK

The SDK provides a simple client for evaluating feature flags from another application.

Create a client:

```typescript
import { FeatureFlagClient } from "@feature-flag-system/sdk";

const client = new FeatureFlagClient({
  baseUrl: "http://localhost:4000",
  environment: "staging",
  fallback: false,
});
```

Evaluate a flag:

```typescript
const enabled = await client.isEnabled("checkout", "user123");

console.log(enabled);
```

The SDK calls the evaluation API and returns the `enabled` value from the response.

### Fallback Behavior

The SDK supports a fallback value:

```typescript
const client = new FeatureFlagClient({
  baseUrl: "http://localhost:4000",
  environment: "staging",
  fallback: false,
});
```

If the evaluation service is unreachable, or the API returns an unsuccessful HTTP response, the SDK returns the configured fallback value.

For example:

```typescript
const client = new FeatureFlagClient({
  baseUrl: "http://localhost:9999",
  environment: "staging",
  fallback: true,
});

const enabled = await client.isEnabled("checkout", "user123");
```

If the service at port `9999` cannot be reached, `enabled` will be:

```text
true
```

because the configured fallback is `true`.

## Usage Examples

### Example 1: List Flags

Request:

```bash
curl http://localhost:4000/flags
```

Response:

```json
[
  {
    "id": "25a18a4a-df26-4b99-8bdc-f1315f9f2316",
    "key": "checkout",
    "description": "New checkout flow",
    "createdAt": "2026-08-11T09:43:50.186Z",
    "environments": [
      {
        "environment": "staging",
        "enabled": true,
        "rolloutPercentage": 0
      },
      {
        "environment": "production",
        "enabled": true,
        "rolloutPercentage": 0
      }
    ]
  }
]
```

### Example 2: Evaluate a Flag

Request:

```bash
curl "http://localhost:4000/evaluate/checkout/staging?userId=user123"
```

Response:

```json
{
  "flag": "checkout",
  "environment": "staging",
  "enabled": true,
  "reason": "ROLLOUT_MATCH"
}
```

### Example 3: Create a Flag

Request:

```bash
curl -X POST http://localhost:4000/flags   -H "Content-Type: application/json"   -d '{
    "key": "new-dashboard",
    "description": "New dashboard experience",
    "actorId": "monda"
  }'
```

Response:

```json
{
  "message": "Flag created successfully.",
  "flag": {
    "key": "new-dashboard",
    "description": "New dashboard experience"
  },
  "environments": ["staging", "production"]
}
```

### Example 4: Add a Targeted User

Request:

```bash
curl -X POST   http://localhost:4000/flags/checkout/staging/targets   -H "Content-Type: application/json"   -d '{"userId":"user123"}'
```

The user is then included in the targeting list for the `checkout` flag in `staging`.

## Known Limitations

- The current environment configuration is defined through the backend environment variable and requires restarting the backend when the supported environment list changes.
- Authentication and authorization for the admin UI are not implemented.
- The system uses PostgreSQL directly through Drizzle ORM and therefore requires a running PostgreSQL instance.
- The SDK depends on the evaluation API being reachable unless a fallback value is configured.
- Rollout decisions use a 100-bucket range (`0` to `99`), so the percentage assignment is based on those buckets.
- The current SDK exposes a simple `isEnabled` method rather than advanced local caching or offline evaluation.
- History is append-only through the application API, but the database itself should still be protected with appropriate database permissions in a production deployment.
