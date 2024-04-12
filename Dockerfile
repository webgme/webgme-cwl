#FROM openjdk:18-alpine
FROM alpine:3.18
MAINTAINER Tamas Kecskes <tamas.kecskes@vanderbilt.edu>




RUN apk add --update nodejs npm git
RUN apk add openjdk20  --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/

ADD . /usr/app/
WORKDIR /usr/app
RUN npm i --no-package-lock

CMD ["npm", "start"]