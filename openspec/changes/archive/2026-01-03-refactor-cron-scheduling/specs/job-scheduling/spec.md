# Spec: job-scheduling

## Overview
Cron-based job scheduling system for automated bot tasks. Uses `node-cron` for precise, calendar-based execution with timezone support.

## ADDED Requirements

### Requirement: Cron-based job execution
The system SHALL use cron expressions to schedule all automated jobs, replacing interval-based polling.

#### Scenario: Job executes at scheduled time
- **GIVEN** a job is registered with cron expression `0 * * * *`
- **AND** the current time reaches the top of an hour
- **WHEN** the cron scheduler triggers
- **THEN** the job callback executes exactly once
- **AND** no polling or condition checking occurs between executions

#### Scenario: Multiple jobs with same schedule
- **GIVEN** two jobs are registered with the same cron expression
- **WHEN** the scheduled time arrives
- **THEN** both jobs execute independently
- **AND** failure of one job does not affect the other

---

### Requirement: Timezone configuration
The system SHALL execute all scheduled jobs using the Europe/Paris timezone to ensure consistent timing regardless of server location.

#### Scenario: Job scheduled for Paris time
- **GIVEN** a job is scheduled for `0 11 * * *` (11:00 AM)
- **AND** the server is running in UTC timezone
- **WHEN** the time reaches 11:00 AM in Europe/Paris
- **THEN** the job executes
- **AND** it does NOT execute at 11:00 UTC

#### Scenario: Daylight saving time transition
- **GIVEN** a job is scheduled for 11:00 AM Paris time
- **AND** Europe/Paris transitions between CET and CEST
- **WHEN** the clock changes for daylight saving
- **THEN** the job continues to execute at 11:00 AM local Paris time
- **AND** the UTC offset adjusts automatically

---

### Requirement: Job registration on startup
The system SHALL register all cron jobs when the bot's ready event fires.

#### Scenario: Bot connects to Discord
- **GIVEN** the bot successfully authenticates with Discord
- **WHEN** the 'ready' event triggers
- **THEN** all scheduled jobs are registered with the cron scheduler
- **AND** jobs begin executing according to their schedules
- **AND** console logs confirm successful registration

#### Scenario: Job continues after initial registration
- **GIVEN** a job has been registered on startup
- **WHEN** the bot remains connected
- **THEN** the job continues to fire at each scheduled time
- **AND** no re-registration is required

---

### Requirement: Existing job schedules
The system SHALL maintain equivalent scheduling for existing jobs using cron expressions.

#### Scenario: channelCleanup runs hourly
- **GIVEN** the channelCleanup job is registered
- **WHEN** the top of each hour arrives (XX:00)
- **THEN** the channelCleanup function executes

#### Scenario: serverStats runs every 10 minutes
- **GIVEN** the serverStats job is registered
- **WHEN** the time reaches any 10-minute mark (XX:00, XX:10, XX:20, etc.)
- **THEN** the serverStats function executes

#### Scenario: manageRoles runs hourly
- **GIVEN** the manageRoles job is registered
- **WHEN** the top of each hour arrives (XX:00)
- **THEN** the manageRoles function executes

---

### Requirement: Error isolation
The system SHALL isolate job failures to prevent cascading effects on other scheduled jobs.

#### Scenario: Job throws exception
- **GIVEN** a scheduled job encounters an error during execution
- **WHEN** the error is thrown
- **THEN** the error is logged to console
- **AND** other scheduled jobs continue to execute normally
- **AND** the failed job remains scheduled for its next execution time
