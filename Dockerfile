# Start with Ubuntu 14.04 (LTS), and build badssl.com up from there
FROM ubuntu:14.04
MAINTAINER April King <april@twoevils.org>
EXPOSE 80 443
RUN apt-get update && apt-get install -y \
    git \
    make \
    nginx

# Install badssl.com
ADD . badssl.com
RUN cd badssl.com ; make install

# Start things up!
CMD nginx && tail -f /var/log/nginx/access.log /var/log/nginx/error.log
