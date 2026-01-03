# monthly-weather-message Specification

## Purpose
TBD - created by archiving change refactor-cron-scheduling. Update Purpose after archive.
## Requirements
### Requirement: Monthly message scheduling
The system SHALL send a message to the configured weather channel on the first day of each month at 11:00 AM Paris time using cron scheduling.

#### Scenario: First of month at 11:00 AM
- **GIVEN** the cron job `0 11 1 * *` is registered
- **AND** the current date/time reaches 11:00 AM on the 1st of a month in Europe/Paris
- **WHEN** the cron scheduler triggers
- **THEN** the bot sends the configured message to the CHANNEL_METEO channel
- **AND** logs a success message to console

#### Scenario: Message not sent on other days
- **GIVEN** the monthly message cron job is registered
- **AND** the current date is not the 1st of the month
- **WHEN** 11:00 AM arrives
- **THEN** the cron job does not trigger
- **AND** no message is sent

---

### Requirement: Message content delivery
The system SHALL send a specific French-language message encouraging weather discussion and personal decision-making responsibility.

#### Scenario: Message sent successfully
- **GIVEN** the cron job triggers on the 1st of month at 11:00 AM
- **AND** the CHANNEL_METEO channel exists and is accessible
- **WHEN** the monthly message job executes
- **THEN** the bot sends the following text:
  "Tu hésites à aller voler ? Tu as besoin d'aide pour ton analyse météo ? N'hésite pas à poser tes questions ici et à partager tes doutes. Les points de vue météo des autres pilotes sont des avis, pas des décisions. Au final, voler ou non reste un choix personnel, qui n'engage que toi."
- **AND** the message is sent as plain text (not an embed)

---

### Requirement: Channel identification
The system SHALL identify the target weather analysis channel using an environment variable configuration.

#### Scenario: Channel found by environment variable
- **GIVEN** the `CHANNEL_METEO` environment variable is set to a valid channel name
- **AND** a text channel with that exact name exists in the guild
- **WHEN** the monthly message job executes
- **THEN** the bot successfully locates and sends to the channel

#### Scenario: Channel not found
- **GIVEN** the `CHANNEL_METEO` environment variable is set
- **AND** no channel with that name exists in the guild
- **WHEN** the monthly message job executes
- **THEN** the bot logs an error: `Weather channel "{CHANNEL_METEO}" not found`
- **AND** does not crash
- **AND** continues normal operation

#### Scenario: Missing environment variable
- **GIVEN** the `CHANNEL_METEO` environment variable is not defined
- **WHEN** the bot application starts
- **THEN** the environment validation fails
- **AND** the bot does not start
- **AND** an error indicates the missing variable

---

### Requirement: Duplicate send prevention
The system SHALL prevent sending multiple messages on the same day if the bot restarts.

#### Scenario: Bot restarts after message sent
- **GIVEN** the monthly message was already sent today
- **AND** the bot restarts before midnight
- **WHEN** the cron job check occurs (if within the 11:00 hour)
- **THEN** the bot checks recent channel history
- **AND** does not send a duplicate message

#### Scenario: Fresh month execution
- **GIVEN** it is the 1st of a new month
- **AND** no message has been sent this month
- **WHEN** the cron job triggers at 11:00 AM
- **THEN** the message is sent
- **AND** only one message appears for that month

---

### Requirement: Error handling
The system SHALL handle errors gracefully without affecting other bot functions.

#### Scenario: Discord API error
- **GIVEN** the Discord API returns an error when posting the message
- **WHEN** the send operation fails
- **THEN** the error is logged to console
- **AND** the bot continues running
- **AND** other jobs are not affected

