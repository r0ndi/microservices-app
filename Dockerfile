FROM ubuntu:20.04

WORKDIR /app

COPY . .

RUN \
  apt-get update -y &&\
  apt-get install -y --no-install-recommends ca-certificates apt-transport-https curl &&\
  curl -sL https://deb.nodesource.com/setup_16.x | bash - &&\
  apt-get update -y &&\
  apt-get install -y --no-install-recommends \
    nodejs \
    dpkg-dev \
    mc less nano wget curl git htop unzip vim sudo \
    build-essential \
    postgresql-common \
    postgresql-client \
    file \
    bash-completion \
    zsh

RUN \
  npm i -g npm@6.14.4
