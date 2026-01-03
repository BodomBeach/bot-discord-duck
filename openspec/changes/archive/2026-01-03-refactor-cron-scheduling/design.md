# Design: refactor-cron-scheduling

## Context
The bot currently uses `setInterval` for all scheduled jobs. Each job polls every N milliseconds and checks if conditions are met. This works but is inefficient and imprecise for calendar-based scheduling.

## Goals
- Replace polling with event-driven cron scheduling
- Enable precise monthly/weekly/daily job execution
- Maintain existing job functionality with improved timing accuracy

## Non-Goals
- Persisting job state across restarts (out of scope)
- Distributed job scheduling (single bot instance)
- Job queuing or retry logic

## Decision: Use node-cron

**Choice**: `node-cron` library for cron-based scheduling

**Why node-cron**:
- Mature: 10+ years, 1M+ weekly npm downloads
- Simple API: `cron.schedule('* * * * *', callback)`
- Timezone support: Native `timezone` option
- Lightweight: ~30KB, no heavy dependencies
- Well-typed: `@types/node-cron` available

**Alternatives considered**:

| Option | Pros | Cons |
|--------|------|------|
| `node-schedule` | More features | Heavier, overkill for this use case |
| `bree` | Worker threads | Complex, designed for heavy jobs |
| `agenda` | MongoDB persistence | Requires DB, too heavyweight |
| Custom implementation | No deps | Reinventing the wheel |

## Implementation Pattern

### Before (setInterval)
```typescript
// ready.ts
setInterval(() => { channelCleanup(client) }, 3600000);
setInterval(() => { serverStats(client) }, 600000);
setInterval(() => { manageRoles(client) }, 3600000);
setInterval(() => { monthlyWeatherMessage(client) }, 3600000); // checks date each time
```

### After (node-cron)
```typescript
// ready.ts
import cron from 'node-cron';

const TIMEZONE = 'Europe/Paris';

// Hourly jobs at :00
cron.schedule('0 * * * *', () => channelCleanup(client), { timezone: TIMEZONE });
cron.schedule('0 * * * *', () => manageRoles(client), { timezone: TIMEZONE });

// Every 10 minutes
cron.schedule('*/10 * * * *', () => serverStats(client), { timezone: TIMEZONE });

// Monthly: 1st of month at 11:00 AM
cron.schedule('0 11 1 * *', () => monthlyWeatherMessage(client), { timezone: TIMEZONE });
```

## Cron Expression Reference

```
┌────────── minute (0-59)
│ ┌──────── hour (0-23)
│ │ ┌────── day of month (1-31)
│ │ │ ┌──── month (1-12)
│ │ │ │ ┌── day of week (0-7, 0 and 7 = Sunday)
│ │ │ │ │
* * * * *
```

| Job | Expression | Meaning |
|-----|------------|---------|
| channelCleanup | `0 * * * *` | Every hour at :00 |
| serverStats | `*/10 * * * *` | Every 10 minutes |
| manageRoles | `0 * * * *` | Every hour at :00 |
| monthlyWeatherMessage | `0 11 1 * *` | 11:00 AM, 1st of month |

## Timezone Handling

All jobs use `Europe/Paris` timezone explicitly. This ensures:
- 11:00 AM Paris time fires at 11:00 regardless of server location
- DST transitions handled automatically by node-cron
- Consistent behavior across development and production environments

## Risks & Trade-offs

**Trade-off**: Jobs now fire at fixed times (:00, :10, :20...) instead of "bot start time + interval"
- **Impact**: If bot starts at 10:45, first hourly job runs at 11:00 (15 min wait) instead of 11:45
- **Verdict**: This is actually better - predictable timing, easier to reason about

**Risk**: Bot restart during job execution
- **Mitigation**: Jobs are stateless and idempotent; re-running is safe
- Monthly message has duplicate prevention via message history check

## Open Questions
None - straightforward migration with clear patterns.
