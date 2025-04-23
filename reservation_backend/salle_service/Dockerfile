FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install && npm audit fix --force
COPY index.js .
COPY package.json .
COPY .env .
COPY . .
# Port 
EXPOSE 3004

# Commande de démarrage
CMD ["node", "index.js"]
