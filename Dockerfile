# Utilisation d'une image Node.js Alpine pour le développement Angular
FROM node:22-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Installer l'Angular CLI globalement
RUN npm install -g @angular/cli

# Copier les fichiers du projet dans le conteneur
COPY . .

# Exposer le port 4200 pour le serveur de développement Angular
EXPOSE 4200

# Commande pour démarrer le serveur de développement Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "500"]