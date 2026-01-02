import { Client, ChannelType } from "discord.js";

/**
 * Manage yearly license roles:
 * - Create current year role if it doesn't exist
 * - Copy permissions from previous year role to current year role
 * - Copy categories permission overwrites from previous year role to current year role
 */
export async function manageRoles(client: Client) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) return;

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const rolePrefix = process.env.ROLE_LICENCIE_PREFIX!;
  const currentRoleName = `${rolePrefix} ${currentYear}`;
  const previousRoleName = `${rolePrefix} ${previousYear}`;

  // Find existing role
  const currentRole = guild.roles.cache.find(role => role.name === currentRoleName);

  // Early return if current role already exists
  if (currentRole) {
    return;
  }

  // Create current year role
  const previousRole = guild.roles.cache.find(role => role.name === previousRoleName);

  if (!previousRole) {
    console.log(`Cannot create ${currentRoleName}: previous year role not found`);
    return;
  }

  console.log(`Creating role: ${currentRoleName}`);

  try {
    // Create the new role with the same permissions and color as the previous year. Place the new role just above the previous role in hierarchy.
    const newRole = await guild.roles.create({
      name: currentRoleName,
      color: previousRole.color,
      permissions: previousRole.permissions,
      hoist: previousRole.hoist,
      mentionable: previousRole.mentionable,
      reason: `Automatic creation of ${currentYear} license role`,
      position: previousRole.position + 1
    });

    console.log(`✓ Successfully created role: ${currentRoleName}`);

    // Copy permission overwrites from previous role to new role on all categories
    const categories = guild.channels.cache.filter(
      channel => channel.type === ChannelType.GuildCategory
    );

    for (const [, category] of categories) {
      const permissionOverwrites = category.permissionOverwrites.cache.get(previousRole.id);
      if (!permissionOverwrites) continue;

      try {
        await category.permissionOverwrites.edit(newRole.id, {
          ...Object.fromEntries([
            ...permissionOverwrites.allow.toArray().map(p => [p, true]),
            ...permissionOverwrites.deny.toArray().map(p => [p, false])
          ])
        }, { reason: `Copy permissions from ${previousRoleName} to ${currentRoleName}` });

        console.log(`  ✓ Copied permissions to category: ${category.name}`);
      } catch (err) {
        console.error(`  ✗ Failed to copy permissions to category ${category.name}:`, err);
      }
    }
  } catch (error) {
    console.error(`Failed to create role ${currentRoleName}:`, error);
  }
}
