# Bot discord du Duck-parapente

Bot utilisant l'API  [discord.js](https://discord.js.org/) pour intéragir avec le serveur discord du Duck.

Projet bénévole porté par les membres du club.

## Usage
### Commandes disponibles
- `/archive` - déplace le salon dans le bon dossier 📁ARCHIVES. Créé un nouveau dossier 📁ARCHIVES si besoin. Uniquement [Sorties/Événements/Compétitions]
- `/balise`  - affiche les dernières valeurs et directions de vent autour de Grenoble. Source : [murblanc.org/sthil](https://murblanc.org/sthil)

### Jobs automatiques
- `Toutes les heures`  - archive les salons périmés des catégories [Sorties] (uniquement si le format de date est valide, e.g. 28-02-chamrousse)
- `Toutes les 10min` - met à jour les stats du serveur dans le salon `ADMIN > STATS`
- `À chaque création de salon` - si le nombre de salons total est supérieur à 498, supprime automatiquement l'archive la plus vieille pour ne jamais atteindre la limite native de 500 salons.

## Todo

- Fonction qui manipule les rôles des membres pour afficher certains salons uniquement aux membres ayant cotisé au club pour l'année en cours
- Commande `live` pour mettre de suivre les canards crosseurs sur une journée
- Améliorer la commande `/archive` pour qu'elle transforme le salon en thread dans un unique salon `archives`, nous permettant alors de garder l'historique des sorties ad vitam aeternam (@Romain.L ?)
- Commande `/notam` pour afficher toutes les NOTAM en cours entre 2 points GPS
- Ajouter un webhook qui notifie la création d'un nouvel article sur le site du Duck
- Ajouter un salon `creation-sorties` où seul le bot peut écrire, pour les membres qui souhaitent recevoir une notification lorsqu'une nouvelle sortie est proposée

## Installation

### Prérequis

- Installer docker et docker-compose
- Créer un fichier `.env` à la racine en suivant cet exemple :
```bash
GUILD_ID=ID_DU_SERVEUR
BOT_TOKEN=TOKEN_DU_BOT
```

### CLI
```bash
docker compose up --build
```