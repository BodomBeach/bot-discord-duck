# Bot discord du Duck-parapente

Bot utilisant l'API [discord.js](https://discord.js.org/) pour intéragir avec le serveur discord du Duck.

Projet bénévole porté par les membres du club.

## Usage

### Commandes disponibles

- `/licence` - permet au membre d'activer sa licence FFVL sur discord, lui donnant accès à tous les salons pour l'année en cours (gain du rôle "Licencié")
- `/archive` - déplace le salon dans le bon dossier 📁ARCHIVES. Créé un nouveau dossier 📁ARCHIVES si besoin. Uniquement [Sorties/Événements/Compétitions]
- `/balise` - affiche les dernières valeurs et directions de vent autour de Grenoble. Source : [murblanc.org/sthil](https://murblanc.org/sthil)

### Jobs automatiques

- `Toutes les heures` - Archive les salons périmés des catégories [Sorties] (avec une tolérance de 1 jour, exemple : 28-02-chamrousse sera archivé automatiquement le 30-09 à 1h du matin). Fonctionne uniquement pour les salons ayant un nom valide (28-02-chamrousse)
- `À chaque création de salon` - si le nombre de salons total est supérieur à 495, supprime automatiquement l'archive la plus vieille pour ne jamais atteindre la limite native de 500 salons.
- `Toutes les 10min` - met à jour les stats du serveur dans le salon `ADMIN > STATS`

## Todo

- Commande `live` pour mettre de suivre les canards crosseurs sur une journée
- Commande `/notam` pour afficher toutes les NOTAM en cours entre 2 points GPS
- Améliorer la commande `/archive` pour qu'elle transforme le salon en thread dans un unique salon `archives`, nous permettant alors de garder l'historique des sorties ad vitam aeternam (@Romain.L ?)
- Ajouter un webhook qui notifie la création d'un nouvel article sur le site du Duck
- Ajouter un salon `creation-sorties` où seul le bot peut écrire, pour les membres qui souhaitent recevoir une notification lorsqu'une nouvelle sortie est proposée
- ~~Fonction de covoiturage~~ -> abandonné, trop compliqué à mettre en oeuvre

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
