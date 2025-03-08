FROM node:20.11.1-bullseye-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install app dependencies

RUN npm install

# Bundle app source

EXPOSE 3001

CMD [ "npm", "run", "dev" ]