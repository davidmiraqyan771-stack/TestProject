FROM node:20

WORKDIR /app

COPY . .

ENV MONGO_PORT=27223 \
    PORT=3001  

RUN npm i

ENTRYPOINT [ "npm" ]

CMD [ "start" ]

