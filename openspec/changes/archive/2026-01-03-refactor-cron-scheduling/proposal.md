# Proposal: refactor-cron-scheduling

## Summary
Refactor all scheduled jobs from setInterval polling to cron-based execution using `node-cron`. This enables precise calendar-based scheduling (like monthly jobs) and eliminates wasteful polling overhead.

## Why
The current setInterval pattern checks conditions hourly even when nothing needs to run. This is inefficient and imprecise:
- **Waste**: 8,760 checks/year for a job that runs 12 times
- **Imprecision**: If check runs at 11:58, the 11:00 AM window is missed entirely
- **Scalability**: Each new job adds another polling loop
- **Wrong abstraction**: We're building a scheduler on top of a scheduler

The immediate motivation is adding a monthly weather message that must fire at exactly 11:00 AM on the 1st of each month. The current system cannot guarantee this precision.

## What Changes
- **BREAKING**: Remove all setInterval-based job scheduling in `ready.ts`
- Add `node-cron` dependency for declarative cron scheduling
- Migrate existing jobs to cron expressions:
  - `channelCleanup`: `0 * * * *` (every hour at :00)
  - `serverStats`: `*/10 * * * *` (every 10 minutes)
  - `manageRoles`: `0 * * * *` (every hour at :00)
- Add new monthly weather message: `0 11 1 * *` (11:00 AM, 1st of month)
- All jobs use `Europe/Paris` timezone explicitly

## Impact
- Affected code: `src/events/ready.ts`, all files in `src/jobs/`
- New dependency: `node-cron` (~30KB)
- Affected specs: Creates new `job-scheduling` capability spec

## Benefits
- **Precision**: Jobs execute exactly when scheduled, not "sometime within the hour"
- **Efficiency**: Zero CPU overhead between executions
- **Clarity**: Cron expressions are industry-standard and self-documenting
- **Scalability**: 100 jobs = same overhead as 1 job

## Risks & Mitigations
- **Risk**: Breaking change to job execution timing
  - **Mitigation**: Jobs will now run at :00 instead of "whenever bot started + interval". This is actually more predictable.
- **Risk**: New dependency
  - **Mitigation**: `node-cron` is mature (10+ years), 1M+ weekly downloads, minimal footprint
- **Risk**: Cron syntax unfamiliar to some developers
  - **Mitigation**: Add comments explaining each expression; well-documented in README

## Alternatives Considered
1. **Keep setInterval, add monthly check**: Rejected - perpetuates inefficient pattern, imprecise timing
2. **External cron service**: Rejected - adds operational complexity, keeps logic outside bot
3. **Hybrid approach (keep old, add cron for new)**: Rejected - inconsistent patterns, tech debt accumulation
