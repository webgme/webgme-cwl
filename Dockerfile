FROM openjdk:18-alpine
MAINTAINER Tamas Kecskes <tamas.kecskes@vanderbilt.edu>

RUN apk add --update nodejs npm git

ADD . /usr/app/
WORKDIR /usr/app
RUN npm i --no-package-lock

CMD ["npm", "start"]