# Dockerfile for Salle Service
FROM node:18

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Port 
EXPOSE 3004

# Commande de démarrage
CMD ["node", "index.js"]
