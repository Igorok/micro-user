FROM node:18-alpine  As development

ENV APP_PORT=3002
ENV APP_ENV=DEV
ENV DOC_USER=usr
ENV DOC_PASS=pass
ENV MONGO_URI=mongodb://micro_user:micro_pwd@localhost:27017/micro_users
ENV KAFKA_URI=localhost:9094
ENV KAFKA_ANALYSIS_MESSAGE_TOPIC=analysis-message
ENV KAFKA_ANALYSIS_MESSAGE_GROUP=analysis-messages-users
ENV VIOLATION_LIMIT=5

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3002

CMD [ "npm", "run", "start:dev" ]
