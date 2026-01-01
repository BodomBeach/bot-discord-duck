import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, TextChannel } from 'discord.js';
import axios from 'axios';
import sqlite3 from 'sqlite3';

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
export const create = () => {
  const command = new SlashCommandBuilder()
    .setName('licence')
    .setDescription('Active ta licence FFVL pour obtenir l\'accès complet au Discord')
    .addStringOption(option =>
      option.setName('numero_licence')
        .setDescription('Ton numéro de licence FFVL (https://intranet.ffvl.fr)')
        .setRequired(true));
  return command.toJSON();
};

export const invoke = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });

  const db = new sqlite3.Database('db/db.sqlite');
  const username = interaction.user.username;
  const licenseNumber = interaction.options.getString('numero_licence');
  const currentYear = new Date().getFullYear();
  const structureId = process.env.STRUCTURE_ID;
  const targetRole = interaction.guild?.roles.cache.find(role => role.name == process.env.ROLE_LICENCIE_PREFIX + ' ' + currentYear);

  console.log(`${interaction.user.displayName} (${interaction.user.username}) used /licence ${licenseNumber}`);

  if (!targetRole) {
    await interaction.editReply(`Le rôle Licencié ${currentYear} n'existe pas.`);
    return;
  }

  const member = interaction.member as GuildMember;

  // Check if user already has role
  if (member.roles.cache.has(targetRole.id)) {
    await interaction.editReply(`Tu as déjà le rôle **${targetRole}** :wink:`);
    return;
  }

  // Check if user already has a licence activated for current year
  const alreadyActivated = await asyncGet(db, 'SELECT * FROM licenses WHERE username = ? AND year = ?', [username, currentYear]);
  if (alreadyActivated) {
    await interaction.editReply(`Ton compte Discord est déjà associé à la licence **${alreadyActivated.license_number}**. En cas de problème, tu peux contacter un admin (ceux qui ont un pseudo couleur rouge).`);
    return;
  }

  // Check if licence number is already taken by someone else for the current year
  const licenseTaken = await asyncGet(db, 'SELECT * FROM licenses WHERE license_number = ? AND year = ?', [licenseNumber, currentYear]);
  if (licenseTaken && licenseTaken.username !== username) {
    await interaction.editReply(`La licence **${licenseNumber}** est déjà associée à un autre utilisateur pour l'année ${currentYear}. En cas de problème, tu peux contacter un admin.`);
    return;
  }

  // console.log(`https://data.ffvl.fr/php/verif_lic_adh.php?num=${licenseNumber}&stru=${structureId}`);
  const response = await axios.get(`https://data.ffvl.fr/php/verif_lic_adh.php?num=${licenseNumber}&stru=${structureId}`);

  // Not entirely sure as we could not get more details from FFVL API, but we assume the following :
  // Response = 0 : user does not have a valid license
  // Response = 1 : user does have a valid licence for year N OR N+1
  // Response = 2 : user has a valid licence for year N and N+1 (early renewal)
  if (response.data > 0) {
    await member.roles.add(targetRole);
    // Insert row into db
    db.run(`INSERT INTO licenses(username, license_number, year) VALUES(?, ?, ?);`, [username, licenseNumber, currentYear], function (err) {
      if (err) { console.log(err.message); }
      console.log(`License succesfully activated for user ${username}`);
    });

    await interaction.editReply({ content: successMessage(interaction, currentYear, targetRole.name) });
  } else {
    console.log(`License not found ${username}`);
    await interaction.editReply({ content: failureMessage(currentYear) });
  }
};

const successMessage = (interaction: ChatInputCommandInteraction, year: number, roleName: string) => {
  const guideChannel = interaction.guild?.channels.cache.find(channel => channel.name === process.env.CHANNEL_GUIDE_DISCORD);
  const guideRef = guideChannel ? `<#${guideChannel.id}>` : '#📋guide-discord';
  return `
:white_check_mark: Bien joué, ton numéro de licence a bien été activé :partying_face:
Tu as désormais le rôle **${roleName}** et tu as accès à tous les salons pour l'année ${year} :duck:
Pour t'aider à t'y retrouver dans le discord, on te recommande de lire ce petit guide ${guideRef}
  `;
};

const failureMessage = (year: number) => {
  return `
Une erreur est survenue avec ce numéro de licence :thinking:
Soit ce numéro de licence n'existe pas à la FFVL
Soit le numéro existe mais la cotisation au Duck n'a pas été enregistrée pour l'année ${year}
En cas de problème, tu peux contacter un admin.
  `;
};

interface LicenseRow {
  id: number;
  username: string;
  license_number: string;
  year: number;
  created_at: string;
}

const asyncGet = (db: sqlite3.Database, sql: string, params: any[]): Promise<LicenseRow | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as LicenseRow | undefined);
      }
    });
  });
};
