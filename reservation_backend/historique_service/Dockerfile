# Dockerfile for the historique service
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install && npm audit fix --force
COPY index.js .
COPY package.json .
COPY .env .
COPY . .
EXPOSE 3005
CMD ["node", "index.js"]
