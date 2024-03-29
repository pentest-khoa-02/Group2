FROM node:20-alpine


RUN mkdir /usr/app

WORKDIR /usr/app

COPY . .

RUN npm install

RUN chmod +x scripts/entrypoint.sh scripts/wait-for-it.sh


EXPOSE 3000

CMD [ "sh", "scripts/entrypoint.sh"]