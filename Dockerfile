FROM node:16-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm config set strict-ssl=false
RUN npm install -g @angular/cli
RUN npm install --force
COPY . ./
RUN npm run build
EXPOSE 8080
CMD [ "node", "server.js" ]
