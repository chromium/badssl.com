all:

SITE = badssl.com
URL = "https://${SITE}/"

.PHONY: open
open:
	open "${URL}"

.PHONY: clean
clean:
	rm -f /etc/keys/*.key
	find certs -maxdepth 1 -type f ! -iname "dh-*" ! -iname '.gitignore' -delete
	rm -f common/certs/*.pem
	rm -f certs/self-signed/*.key
	rm -f certs/self-signed/*.pem

.PHONY: keys
keys:
	./_site/certs/cert-generator/cert-generator.sh y

.PHONY: install-keys
install-keys:
	mkdir -p /etc/keys
	cp ./_site/certs/self-signed/*.key /etc/keys
	cp ./_site/certs/self-signed/*.pem ./_site/certs/
	mkdir -p ./_site/common/certs # Jekyll doesn't copy empty directories.
	cp ./_site/certs/self-signed/*.pem ./_site/common/certs/

.PHONY: link
link:
	if [ ! -d /var/www ]; then mkdir -p /var/www; fi
	if [ ! -d /var/www/badssl ]; then ln -sf "`pwd`" /var/www/badssl; fi
	if [ -f /etc/nginx/nginx.conf ] ; then sed -i '/Virtual Host Configs/a include /var/www/badssl/_site/nginx.conf;' /etc/nginx/nginx.conf; else @echo "Please add `pwd`/_site/nginx.conf to your nginx.conf configuration."; fi

.PHONY: install
install: keys install-keys link

.PHONY: jekyll
jekyll:
	rm -rf ./_site/
	DOMAIN="${SITE}" HTTP_DOMAIN="http.${SITE}" jekyll build

.PHONY: docker
docker: jekyll
	sudo docker build -t badssl .

## Deployment

.PHONY: deploy
deploy: upload nginx

.PHONY: upload
upload: jekyll
	rsync -avz \
		-e "ssh -i ${HOME}/.ssh/google_compute_engine" \
		--exclude .DS_Store \
		--exclude .git \
		--exclude domains/cert/rsa512.badssl.com \
		--exclude domains/cert/rsa512.badssl.com.conf \
		--exclude domains/cert/rsa1024.badssl.com \
		--exclude domains/cert/rsa1024.badssl.com.conf \
		--exclude domains/cert/1000-sans.badssl.com \
		--exclude domains/cert/1000-sans.badssl.com.conf \
		--exclude domains/cert/10000-sans.badssl.com \
		--exclude domains/cert/10000-sans.badssl.com.conf \
		--delete \
		./ \
		badssl.com:~/badssl/
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: nginx
nginx:
	ssh badssl.com "sudo nginx -t ; sudo service nginx reload"
