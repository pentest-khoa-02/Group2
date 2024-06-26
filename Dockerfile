FROM node:20

WORKDIR /web

COPY . .

RUN npm install

RUN chmod 755 scripts/entrypoint.sh

RUN chmod 755 scripts/wait-for-it.sh

RUN apt-get update && apt-get install -y dos2unix

RUN dos2unix scripts/entrypoint.sh

EXPOSE 3000