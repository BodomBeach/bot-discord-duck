# Tasks: refactor-cron-scheduling

## 1. Setup
- [x] 1.1 Install `node-cron` dependency and its types (`npm install node-cron && npm install -D @types/node-cron`)
- [x] 1.2 Verify package.json updated correctly

---

## 2. Migrate Existing Jobs
- [x] 2.1 Refactor `ready.ts` to import `node-cron` instead of using setInterval for jobs
- [x] 2.2 Convert `channelCleanup` to cron: `0 * * * *` (hourly at :00)
- [x] 2.3 Convert `serverStats` to cron: `*/10 * * * *` (every 10 min)
- [x] 2.4 Convert `manageRoles` to cron: `0 * * * *` (hourly at :00)
- [x] 2.5 Remove all setInterval calls for jobs
- [x] 2.6 Add timezone configuration `Europe/Paris` to all cron jobs

**Validation**: Bot starts without errors; existing jobs continue to function at expected intervals

---

## 3. Add Monthly Weather Message
- [x] 3.1 Simplify `monthlyWeatherMessage.ts` - remove date/time checking logic (cron handles this)
- [x] 3.2 Register monthly job in `ready.ts`: `0 11 1 * *` (11:00 AM, 1st of month, Paris time)
- [x] 3.3 Update duplicate prevention logic (may still need for bot restarts mid-day)

**Validation**: Job registered; manual test by temporarily changing cron to trigger soon

---

## 4. Testing & Verification
- [x] 4.1 Verify all cron jobs are scheduled on bot startup (check console output)
- [x] 4.2 Test `serverStats` fires every 10 minutes (observable)
- [x] 4.3 Test `channelCleanup` and `manageRoles` fire hourly
- [x] 4.4 Test monthly message with temporary cron expression
- [x] 4.5 Verify timezone handling (11:00 Paris = correct UTC offset)

**Validation**: All jobs execute at expected times; no setInterval remnants

---

## 5. Documentation
- [x] 5.1 Update README.md "Jobs automatiques" section to reflect cron-based scheduling
- [x] 5.2 Add cron expression comments in `ready.ts` for clarity
- [x] 5.3 Document monthly weather message job

**Validation**: README accurately describes new scheduling system

---

## Dependencies & Sequencing

**Sequential Requirements**:
1. Task 1 (setup) must complete before Task 2 (migration needs node-cron)
2. Task 2 (migration) should complete before Task 3 (monthly message uses same pattern)
3. Task 4 (testing) depends on Tasks 1-3

**Parallelizable**:
- Task 5 (documentation) can run alongside Task 4 (testing)
