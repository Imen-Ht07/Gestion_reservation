FROM node:18-alpine

WORKDIR /app

# Installer curl pour les healthchecks
RUN apk --no-cache add curl

# Copier les fichiers nécessaires à l'installation
COPY package*.json ./

# Installer les dépendances de production
RUN npm install --production

# Copier tous les fichiers restants du projet
COPY . .

# Créer un répertoire pour les logs
RUN mkdir -p logs

# Exposer le port de l'application
EXPOSE 3003

# Lancer l'application
CMD ["node", "index.js"]
