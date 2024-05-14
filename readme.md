# Bot discord du Duck-parapente

Bot utilisant l'API **discord.js** pour intéragir avec le [serveur discord du Duck](https://discord.gg/2Nh3A8vc).

Projet bénévole porté par les membres du club.

## Usage
### Commandes disponibles
- `/archive` - déplace le salon dans le bon dossier ARCHIVES. Créé un nouveau dossier ARCHIVES si besoin.
- `/balise`  - affiche les dernières valeurs et directions de vent autour de Grenoble. Source : [murblanc.org/sthil](https://murblanc.org/sthil)


### Jobs automatiques
- `every hour`  - archive les salons périmés des catégories [Sorties/Evénements/Compétitions] (uniquement si le format de date est valide, e.g. 28-02-chamrousse)
- `every 10 min` - met à jour les stats du serveur dans le salon `ADMIN > STATS`

## Todo

- Fonction qui manipule les rôles des membres pour afficher certains salons uniquement aux membres ayant cotisé au club pour l'année en cours
- Améliorer la commande `/archive` pour qu'elle transforme le salon en thread dans un unique salon `archives`, nous permettant alors de garder l'historique des sorties ad vitam aeternam (@Romain.L ?)
- Fonction de covoiturage (@JP.DS ?)
- Commande /notam pour afficher toutes les NOTAM en cours entre 2 points GPS

Autres idées :
- Ajouter un webhook qui notifie la création d'un nouvel article sur le site du Duck
- Ajouter un salon `creation-sorties` où seul le bot peut écrire, pour les membres qui souhaitent recevoir une notification lorsqu'une nouvelle sortie est proposée

## Installation

### Prérequis

- Node.js v21.7.3 ou plus récent.
- NPM v6 ou plus récent.
- Créer un fichier `.env` à la racine en suivant cet exemple :
```bash
BOT_TOKEN=Token_du_bot
GUILD_ID=ID_du_serveur
CHROMIUM_PATH=/bin/chromium-browser
```

### CLI
```bash
# installer les dépendances npm
npm i
# run bot
node .
```

PS: Pour utiliser certaines commandes (comme `/balise`) il est nécessaire d'installer Chromium (nécessaire pour Puppeteer). Il faut ensuite indiquer le chemin vers l'éxécutable dans le fichier .env (car différent selon les distrubtions Linux). Voir l'exemple de fichier `.env` ci-dessus.

Debian
```
sudo apt update
sudo apt install chromium
```
Ubuntu
```
sudo apt-get update
sudo apt-get install chromium-browser
```