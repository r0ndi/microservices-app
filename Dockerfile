FROM --platform=linux/amd64 ubuntu:20.04

WORKDIR /app

COPY . .

# Linux
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
    zsh \
    systemd python3-pip

# Node
RUN \
  npm i -g pm2 npm@6.14.4

