# Start with Ubuntu 14.04 (LTS), and build badssl.com up from there
FROM ubuntu:14.04
MAINTAINER April King <april@twoevils.org>
EXPOSE 80 443
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    make \
    nginx \
    ruby2.0 \
    ruby2.0-dev
RUN gem2.0 install jekyll

# Install badssl.com
ADD . badssl.com
WORKDIR badssl.com
RUN make install

# Start things up!
CMD nginx && tail -f /var/log/nginx/access.log /var/log/nginx/error.log
