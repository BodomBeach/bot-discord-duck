class HelpMessage {

  constructor(guild) {
    this.guild = guild
  }

  execute = async () => {

    const regleChannel = await this.parseChannel('📌règles-sorties')
    const spontChannel = await this.parseChannel('🍀sorties-spontanées')
    const blablaChannel = await this.parseChannel('👥bla-bla-parapente')
    const orgaChannel = await this.parseChannel('🔧organisation-du-serveur')
    const devbotChannel = await this.parseChannel('🤖dév-bots')

  return `
:information_source:  **__Guide d'utilisation du discord__ **

- Tu veux planifier une sortie future, c'est par ici ${regleChannel}
- Tu décides d'aller voler au dernier moment (le jour même), pas besoin de créer un salon dédié, il suffit de poster un message dans ${spontChannel}
- Tu veux discuter ou poser une question sur un sujet spécifique ? Il existe surement un salon qui correspond dans la catégorie **🐤 GENERAL**
- Dans **⛰ SITES DE VOL**, nous mettons à jour les informations importantes de chaque site, n'hésite pas à consulter ces salons lorsque tu prépares tes vols.
- Tu ne trouves pas le bon salon ? Tu peux toujours parler dans ${blablaChannel}, où le spam est autorisé !
- Tu reçois trop de notifications ? Discord possède plein d'options pour régler les notifications comme il te plait, ce guide pourra t'aider : <placeholder>
- Tu peux inviter des amis au discord sans restriction.

- Envie d'aider à l'amélioration du serveur, rejoins ${orgaChannel}
- Envie de contribuer à l'amélioration du bot, rejoins ${devbotChannel}
- \`Ctrl + /\` affiche la liste des raccourcis utiles (ordinateur uniquement)

À tout moment, tu peux utiliser la commande **\`/help\`** pour retrouver ce guide.
`
  }

  parseChannel = async (string) => {
    const channel = this.guild.channels.cache.find(channel => channel.name === string)

    // fallback to string if channel is not found
    return channel ? `<#${channel.id}>` : '#' + string;
  }

}
module.exports = { HelpMessage }

