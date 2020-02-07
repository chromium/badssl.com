# Start with Ubuntu 16.04 (LTS), and build badssl.com up from there
FROM ubuntu:16.04
MAINTAINER April King <april@pokeinthe.io>
EXPOSE 80 443
RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install -y software-properties-common
RUN apt-add-repository ppa:brightbox/ruby-ng
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    libffi-dev \
    make \
    nginx \
    ruby2.4 \
    ruby2.4-dev
RUN gem update --system
RUN gem install jekyll

# Install badssl.com
ADD . badssl.com
WORKDIR badssl.com
RUN make inside-docker

# Start things up!
CMD nginx && tail -f /var/log/nginx/access.log /var/log/nginx/error.log
