# Project Context

## Purpose
Discord bot for Duck-parapente (paragliding club) managing member licensing, channel archival, and automated server maintenance.

## Tech Stack
- TypeScript (ES2022, NodeNext modules, strict mode off)
- Node.js with Discord.js v14
- SQLite3 database
- Puppeteer, Axios
- Docker deployment

## Project Conventions

### Code Style
- ES modules with `.js` imports (even for `.ts` files)
- camelCase naming
- French for user messages
- Console logging for events

### Architecture Patterns
- Event-driven: auto-load from `src/events/`
- Commands: `create()` + `invoke()` pattern in `src/events/commands/`
- Jobs in `src/jobs/`, utils in `src/utils/`
- Custom types in `src/types/index.ts`
- SQLite with promise wrappers

### Testing Strategy
Manual testing, no framework currently.

### Git Workflow
- Main: `master`, Dev: `dev`
- Simple descriptive commits

## Domain Context
- **Categories**: Sorties, Événements, Compétitions
- **Archives**: Max 50 channels per folder, auto-numbered
- **Channel naming**: `jour-mois-label` format for outings
- **Roles**: Yearly "Licencié YYYY" with inherited permissions
- **License verification**: FFVL API validates club memberships
- **Jobs**: Stats (10min), channel archival (hourly), cleanup at 495 channels (hourly), role creation (yearly)

## Important Constraints
- Discord 500 channel limit (cleanup at 495)
- FFVL API returns: 0=invalid, 1=valid, 2=early renewal
- Date format required for auto-archival
- Required intents: Guilds, GuildMembers, MessageContent, GuildMessages

## External Dependencies
- FFVL API: `https://data.ffvl.fr/php/verif_lic_adh.php`
- Env vars: `GUILD_ID`, `BOT_TOKEN`, `STRUCTURE_ID`, `ROLE_LICENCIE_PREFIX`, `CHANNEL_GUIDE_DISCORD`


<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->