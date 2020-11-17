FROM node:12

WORKDIR "/app"

RUN apt-get update \
 && apt-get dist-upgrade -y \
 && apt-get clean \
 && echo 'Finished installing dependencies'

COPY package*.json ./

RUN npm install

COPY . /app

ENV PORT 8080

EXPOSE 8080

USER node

CMD ["npm", "start"]
