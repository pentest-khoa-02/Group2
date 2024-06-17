FROM node:20

WORKDIR /web

COPY . .

RUN npm install

RUN chmod 755 scripts/entrypoint.sh

RUN chmod 755 scripts/wait-for-it.sh

EXPOSE 3000