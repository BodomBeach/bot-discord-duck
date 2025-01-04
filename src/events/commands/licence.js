const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
  const command = new SlashCommandBuilder()
    .setName('licence')
    .setDescription('Active ta licence FFVL pour obtenir l\'accès complet au Discord')
    .addStringOption(option =>
      option.setName('numero_licence')
        .setDescription('Ton numéro de licence FFVL (https://intranet.ffvl.fr)')
        .setRequired(true));
  return command.toJSON();
};

const invoke = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const db = new sqlite3.Database('db/db.sqlite')
  const username = interaction.user.username
  const licenseNumber = interaction.options.getString('numero_licence')
  const currentYear = new Date().getFullYear()
  const structureId = process.env.STRUCTURE_ID
  const targetRole = interaction.guild.roles.cache.find(role => role.name == 'Licencié ' + currentYear)

  console.log(`${interaction.user.username} used /licence ${licenseNumber}`);

  // Check if user already has role
  if (interaction.member.roles.cache.hasAny(targetRole.id)) {
    await interaction.editReply(`Tu as déjà le rôle **${targetRole}** :wink:`);
    return
  }

  // Check if user already has a licence activated for current year
  const alreadyActivated = await asyncGet(db, 'SELECT * FROM licenses WHERE username = ? AND year = ?', [username, currentYear])
  if (alreadyActivated) {
    await interaction.editReply(`Ton compte Discord est déjà associé à la licence **${alreadyActivated.license_number}**. En cas de problème, tu peux contacter un admin (ceux qui ont un pseudo couleur rouge).`);
    return
  }

  // Check if licence number is already taken by someone else
  const licenseTaken = await asyncGet(db, 'SELECT * FROM licenses WHERE license_number = ?', [licenseNumber])
  if (licenseTaken) {
    await interaction.editReply(`La licence **${licenseNumber}** est déjà associée à un autre utilisateur. En cas de problème, tu peux contacter un admin.`);
    return
  }
  console.log(`https://data.ffvl.fr/php/verif_lic_adh.php?num=${licenseNumber}&stru=${structureId}`);
  const response = await axios.get(`https://data.ffvl.fr/php/verif_lic_adh.php?num=${licenseNumber}&stru=${structureId}`)
  if (response.data == 1) {

    await interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name == 'Licencié ' + currentYear))
    // Insert row into db
    db.run(`INSERT INTO licenses(username, license_number, year) VALUES(?, ?, ?);`, [username, licenseNumber, currentYear], function (err) {
      if (err) { console.log(err.message); }
      console.log(`License succesfully activated for user ${username}`);
    });

    await interaction.editReply({ content: successMessage(interaction, currentYear, targetRole), ephemeral: true })

  } else {
    console.log(`License not found ${username}`);
    await interaction.editReply({ content: failureMessage(currentYear), ephemeral: true })
  }

};

const successMessage = (interaction, year, role) => {
  const guideChannel = interaction.guild.channels.cache.find(channel => channel.name === 'guide-discord')
  return `
:white_check_mark: Bien joué, ton numéro de licence a bien été activé :partying_face: 
Tu as désormais le rôle **${role}** et tu as accès à tous les salons pour l'année ${year} :duck:
Pour t'aider à t'y retrouver dans le discord, on te recommande de lire ce petit guide ${guideChannel}
  `
}

const failureMessage = (year) => {
  return `
Une erreur est survenue avec ce numéro de licence :thinking:
Soit ce numéro de licence n'existe pas à la FFVL
Soit le numéro existe mais la cotisation au Duck n'a pas été enregistrée pour l'année ${year}
En cas de problème, tu peux contacter un admin.
  `
}

const asyncGet = (db, sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = { create, invoke };