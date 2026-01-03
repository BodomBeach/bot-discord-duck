import 'dotenv/config';
import { Client, GatewayIntentBits, TextChannel, ChannelType, Collection, Message } from 'discord.js';
import fs from 'fs';

// Configuration
const YEAR = 2025;
const START_DATE = new Date(`${YEAR}-01-01T00:00:00.000Z`);
const END_DATE = new Date(`${YEAR}-12-31T23:59:59.999Z`);
const LICENSE_ROLE_NAME = `Licencié ${YEAR}`;
const OUTPUT_FILE = `.local/stats-${YEAR}.json`;
const CHANNELS_CSV_FILE = `.local/channels-${YEAR}.csv`;

// Validate required env vars
if (!process.env.BOT_TOKEN || !process.env.GUILD_ID) {
  console.error('Missing BOT_TOKEN or GUILD_ID environment variables');
  process.exit(1);
}

interface ChannelStats {
  name: string;
  category: string;
  messageCount: number;
}

interface MonthlyStats {
  month: string;
  count: number;
}

interface StatsResult {
  generatedAt: string;
  year: number;
  members: {
    total: number;
    licensed: number;
    active: number;
    activeLicensed: number;
    inactiveLicensed: number;
    newInYear: number;
  };
  monthlyTrend: MonthlyStats[];
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

function shouldExcludeCategory(categoryName: string | null): boolean {
  if (!categoryName) return false;
  const lower = categoryName.toLowerCase();
  return lower.includes('archive') || lower.includes('sites de vol');
}

async function fetchAllMessages(
  channel: TextChannel,
  startDate: Date,
  endDate: Date
): Promise<Collection<string, Message>> {
  const allMessages = new Collection<string, Message>();
  let lastMessageId: string | undefined;
  let fetchedCount = 0;

  while (true) {
    const options: { limit: number; before?: string } = { limit: 100 };
    if (lastMessageId) {
      options.before = lastMessageId;
    }

    try {
      const messages = await channel.messages.fetch(options);

      if (messages.size === 0) break;

      let hasMessagesInRange = false;
      let allBeforeRange = true;

      for (const [id, message] of messages) {
        const msgDate = message.createdAt;

        if (msgDate < startDate) {
          // Message is before our range, we can stop
          allBeforeRange = true;
        } else {
          allBeforeRange = false;
        }

        if (msgDate >= startDate && msgDate <= endDate) {
          allMessages.set(id, message);
          hasMessagesInRange = true;
        }
      }

      fetchedCount += messages.size;
      lastMessageId = messages.last()?.id;

      // If all messages in this batch are before our start date, stop
      if (allBeforeRange && !hasMessagesInRange) break;

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`  Error fetching messages: ${error}`);
      break;
    }
  }

  return allMessages;
}

function getMonthKey(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

function printBar(count: number, maxCount: number, maxWidth: number = 20): string {
  const width = Math.round((count / maxCount) * maxWidth);
  return '\u2588'.repeat(width);
}

async function main() {
  console.log(`\n=== DISCORD YEARLY STATS ${YEAR} ===\n`);
  console.log('Connecting to Discord...');

  await client.login(process.env.BOT_TOKEN);

  const guild = await client.guilds.fetch(process.env.GUILD_ID!);
  console.log(`Connected to: ${guild.name}`);

  // Fetch all members
  console.log('Fetching members...');
  const members = await guild.members.fetch();
  console.log(`Found ${members.size} members`);

  // Find license role
  const licenseRole = guild.roles.cache.find((r) => r.name === LICENSE_ROLE_NAME);
  const licensedMemberIds = new Set<string>();

  if (licenseRole) {
    licenseRole.members.forEach((m) => licensedMemberIds.add(m.id));
    console.log(`Found ${licensedMemberIds.size} licensed members (${LICENSE_ROLE_NAME})`);
  } else {
    console.log(`Warning: License role "${LICENSE_ROLE_NAME}" not found`);
  }

  // Count new members (joined in target year)
  const newMembers = members.filter((m) => {
    const joinDate = m.joinedAt;
    return joinDate && joinDate >= START_DATE && joinDate <= END_DATE;
  });

  // Get all text channels (excluding archives and sites de vol)
  const textChannels = guild.channels.cache.filter(
    (ch) =>
      ch.type === ChannelType.GuildText && !shouldExcludeCategory(ch.parent?.name ?? null)
  ) as Collection<string, TextChannel>;

  console.log(`\nAnalyzing ${textChannels.size} text channels (excluding archives & sites de vol)...`);
  console.log('This may take several minutes depending on message volume.\n');

  // Collect stats
  const channelStats: ChannelStats[] = [];
  const activeMemberIds = new Set<string>();
  const monthlyMessages: Map<string, number> = new Map();

  // Initialize monthly counts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((m) => monthlyMessages.set(m, 0));

  let processedChannels = 0;

  for (const [, channel] of textChannels) {
    processedChannels++;
    process.stdout.write(`\r[${processedChannels}/${textChannels.size}] Analyzing #${channel.name}...`.padEnd(60));

    const messages = await fetchAllMessages(channel, START_DATE, END_DATE);

    // Collect stats from messages
    for (const [, message] of messages) {
      // Track active members (exclude bots)
      if (!message.author.bot) {
        activeMemberIds.add(message.author.id);
      }

      // Track monthly activity
      const monthKey = getMonthKey(message.createdAt);
      monthlyMessages.set(monthKey, (monthlyMessages.get(monthKey) || 0) + 1);
    }

    channelStats.push({
      name: channel.name,
      category: channel.parent?.name || 'No Category',
      messageCount: messages.size
    });
  }

  console.log('\n\n');

  // Sort channels by message count (descending for JSON, ascending for console display)
  channelStats.sort((a, b) => b.messageCount - a.messageCount);

  // Calculate licensed member activity
  const activeLicensedIds = new Set([...activeMemberIds].filter((id) => licensedMemberIds.has(id)));
  const inactiveLicensedIds = new Set([...licensedMemberIds].filter((id) => !activeMemberIds.has(id)));

  // Build monthly trend
  const monthlyTrend: MonthlyStats[] = months.map((m) => ({
    month: m,
    count: monthlyMessages.get(m) || 0
  }));

  // Build result object
  const result: StatsResult = {
    generatedAt: new Date().toISOString(),
    year: YEAR,
    members: {
      total: members.size,
      licensed: licensedMemberIds.size,
      active: activeMemberIds.size,
      activeLicensed: activeLicensedIds.size,
      inactiveLicensed: inactiveLicensedIds.size,
      newInYear: newMembers.size
    },
    monthlyTrend
  };

  // Print results
  console.log('MEMBER STATS');
  console.log('------------');
  console.log(`Total members:         ${formatNumber(result.members.total).padStart(6)}`);
  console.log(`Licensed (${YEAR}):       ${formatNumber(result.members.licensed).padStart(6)}`);
  console.log(`Active members:        ${formatNumber(result.members.active).padStart(6)}`);
  console.log(`Active licensed:       ${formatNumber(result.members.activeLicensed).padStart(6)}`);
  console.log(`Inactive licensed:     ${formatNumber(result.members.inactiveLicensed).padStart(6)}`);
  console.log(`New members (${YEAR}):    ${formatNumber(result.members.newInYear).padStart(6)}`);

  console.log('\n\nCHANNEL ACTIVITY (most to least active)');
  console.log('-'.repeat(60));

  const maxNameLen = Math.max(...channelStats.map((c) => c.name.length), 20);
  const maxCatLen = Math.max(...channelStats.map((c) => c.category.length), 15);

  for (const ch of channelStats) {
    const name = `#${ch.name}`.padEnd(maxNameLen + 1);
    const cat = ch.category.padEnd(maxCatLen);
    const count = formatNumber(ch.messageCount).padStart(8);
    console.log(`${name} | ${cat} | ${count} msgs`);
  }

  console.log('\n\nMONTHLY TREND');
  console.log('-------------');

  const maxMonthly = Math.max(...monthlyTrend.map((m) => m.count));

  for (const m of monthlyTrend) {
    const bar = printBar(m.count, maxMonthly, 30);
    const count = formatNumber(m.count).padStart(6);
    console.log(`${m.month}: ${bar.padEnd(30)} ${count}`);
  }

  // Export to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`\n\nJSON exported to: ${OUTPUT_FILE}`);

  // Export channels to CSV
  const csvLines = ['channel,messages'];
  for (const ch of channelStats) {
    csvLines.push(`${ch.name},${ch.messageCount}`);
  }
  fs.writeFileSync(CHANNELS_CSV_FILE, csvLines.join('\n'));
  console.log(`CSV exported to: ${CHANNELS_CSV_FILE}`);

  // Disconnect
  client.destroy();
  console.log('\nDone!');
}

main().catch((error) => {
  console.error('Error:', error);
  client.destroy();
  process.exit(1);
});
