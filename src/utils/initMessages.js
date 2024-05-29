async function initMessages(client) {

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  welcomeMessage = `
**Bienvenue sur le serveur discord du Duck :duck:**

Ce serveur discord est là pour nous permettre de planifier et d'organiser des sorties, événements club et compétitions.
C'est aussi un endroit où l'on peut discuter de tous les sujets qui concernent le club, le parapente et plus encore !

Avant toute chose, nous t'invitons à compléter les 2 étapes ci-dessous pour profiter pleinement du discord.

**__1 - Configure ton Prénom NOM__**
Pour des raisons de sécurité lors des sorties club et pour assurer une bonne communication entre les membres, il faut renseigner ton nom et prénom usuels. Si tu as plusieurs serveurs discord, ne t'inquiète pas, ce nouveau **Prénom NOM** sera visible uniquement sur le discord du Duck et tu garderas ton pseudonyme sur les autres serveurs.
Voilà comment faire :
- Option 1 :arrow_forward:  Tape la commande **\`/nick\` \`<Prénom>\` \`<NOM>\`** dans le champ de texte en bas de cette page.
- Option 2 :arrow_forward:  https://br.atsit.in/fr/?p=12704

**__2 - Active ta licence__**
Pour avoir accès à tous les salons, tu dois avoir cotisé au Duck pour l'année en cours et activer ta licence FFVL sur discord.
Pour cela, il suffit de taper la commande **\`/licence\`** suivi de ton [numéro de licence FFVL](https://intranet.ffvl.fr) :
Exemple : **\`/licence\` \`0315897E\`**

Notre bot vérifiera que ta cotisation est à jour et te donnera accès au reste des salons !
Si tu rencontres un problème, n'hésite pas à contacter un admin du serveur.
`
  const welcomeChannel = client.channels.cache.find(channel => channel.name === 'bienvenue-et-regles');
  let messages = await welcomeChannel.messages.fetch({ limit: 1 });

  // Create or edit existing embed
  if (messages.size === 0) {
    welcomeChannel.send(welcomeMessage);
  } else {
    messages.first().edit(welcomeMessage);
  };
  console.log('initialized welcome message');
}

module.exports = { initMessages }