FROM node:18.13.0
WORKDIR /app
COPY ./arg.js /app/
COPY ./dir.js /app/
COPY ./pos.js /app/

CMD ["node", "/app/dir.js"]