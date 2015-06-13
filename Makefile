all:

SITE = badssl.com
URL = "https://${SITE}/"

.PHONY: deploy
deploy: upload nginx

.PHONY: upload
upload:
	rsync -avz \
		-e "ssh -i ${HOME}/.ssh/google_compute_engine" \
		--exclude .DS_Store \
		--exclude .git \
		--exclude domains/cert/rsa512.badssl.com \
		--exclude domains/cert/rsa512.badssl.com.conf \
		--exclude domains/cert/rsa1024.badssl.com \
		--exclude domains/cert/rsa1024.badssl.com.conf \
		--delete \
		./ \
		badssl.com:~/badssl/
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: nginx
nginx:
	ssh -i ${HOME}/.ssh/google_compute_engine badssl.com "sudo service nginx reload"
    
.PHONY: open
open:
	open "${URL}"

.PHONY: keys
keys:
	./certs/cert-generator/cert-generator.sh y

.PHONY: install-keys
install-keys:
	mkdir -p /etc/keys
	cp certs/self-signed/*.key /etc/keys
	cp certs/self-signed/*.pem certs/
	cp certs/self-signed/badssl-root.pem domains/misc/http.badssl.com/

.PHONY: install
install: | keys install-keys
	if [ ! -d /var/www ]; then mkdir -p /var/www; fi
	if [ ! -d /var/www/badssl ]; then ln -sf `pwd` /var/www/badssl; fi
	@echo "Please add `pwd`/nginx.conf to your nginx.conf configuration."
