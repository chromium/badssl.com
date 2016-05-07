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
	./certs/cert-generator/cert-generator.sh y

.PHONY: install-keys
install-keys:
	mkdir -p /etc/keys
	cp ./certs/**/*.key /etc/keys
	chmod 640 /etc/keys/*.key
	chmod 750 /etc/keys

.PHONY: link
link:
	if [ ! -d /var/www ]; then mkdir -p /var/www; fi
	if [ ! -d /var/www/badssl ]; then ln -sf "`pwd`" /var/www/badssl; fi
	if [ -f /etc/nginx/nginx.conf ] ; then sed -i '/Virtual Host Configs/a include /var/www/badssl/nginx.conf;' /etc/nginx/nginx.conf; else @echo "Please add `pwd`/nginx.conf to your nginx.conf configuration."; fi

.PHONY: install
install: keys install-keys link

.PHONY: jekyll
jekyll:
	DOMAIN="${SITE}" HTTP_DOMAIN="http.${SITE}" jekyll build
	ln -s ../certs common/certs # Create symlink to certs directory
	./certs/cert-generator/cert-self-signed-symlink-generator.sh # Generate symlinks to self-signed for everything that doesn't exist in certs

.PHONY: docker
docker:
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
		--exclude domains/cert/rsa512 \
		--exclude domains/cert/rsa512.conf \
		--exclude domains/cert/rsa1024 \
		--exclude domains/cert/rsa1024.conf \
		--delete  --delete-excluded \
		./ \
		badssl.com:~/badssl/
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: nginx
nginx:
	ssh badssl.com "sudo nginx -t ; sudo service nginx reload"
