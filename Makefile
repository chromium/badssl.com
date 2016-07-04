################################

# This should bring up a full test server in docker from a bare repo.
# Certs are generated outside the docker container, for persistence.
.PHONY: test
test: certs-test docker-build docker-run

# This should properly deploy from any state of the repo.
.PHONY: deploy
deploy: certs-prod jekyll-prod upload nginx

################################

.PHONY: jekyll-test
jekyll-test:
	DOMAIN="badssl.test" jekyll build

.PHONY: jekyll-prod
jekyll-prod:
	DOMAIN="badssl.com" jekyll build

.PHONY: certs-test
certs-test:
	cd certs && make O=sets/test D=badssl.test
	cd certs/sets && rm -rf current && cp -R test current

.PHONY: certs-prod
certs-prod:
	cd certs && make O=sets/prod D=badssl.com
	cd certs/sets && rm -rf current && cp -R prod current

################ Installation ################

.PHONY: install-keys
install-keys:
	mkdir -p /etc/keys
	cp ./certs/sets/current/gen/key/*.key /etc/keys
	chmod 640 /etc/keys/*.key
	chmod 750 /etc/keys

.PHONY: link
link:
	if [ ! -d /var/www ]; then mkdir -p /var/www; fi
	if [ ! -d /var/www/badssl ]; then ln -sf "`pwd`" /var/www/badssl; fi
	if [ -f /etc/nginx/nginx.conf ] ; then sed -i '/Virtual Host Configs/a include /var/www/badssl/_site/nginx.conf;' /etc/nginx/nginx.conf; else @echo "Please add `pwd`/_site/nginx.conf to your nginx.conf configuration."; fi

.PHONY: install
install: install-keys link

.PHONY: clean
clean:
	rm -rf _site
	rm -f /etc/keys/*.key
	# rm -f common/certs/*.pem
	rm -rf certs/sets/*/gen

################ Docker ################

.PHONY: inside-docker
inside-docker: jekyll-test install

.PHONY: docker-build
docker-build:
	docker build -t badssl .

.PHONY: docker-run
docker-run:
	docker run -it -p 80:80 -p 443:443 -p 1000-1024:1000-1024 badssl

################ Deployment ################

.PHONY: upload
upload:
	rsync -avz \
		-e "ssh -i ${HOME}/.ssh/google_compute_engine" \
		--exclude .DS_Store \
		--exclude .git \
		--exclude _site/domains/cert/rsa512 \
		--exclude _site/domains/cert/rsa512.conf \
		--exclude _site/domains/cert/rsa1024 \
		--exclude _site/domains/cert/rsa1024.conf \
		--delete  --delete-excluded \
		./ \
		badssl.com:~/badssl/
	echo "\nDone deploying.\n"

.PHONY: nginx
nginx:
	ssh badssl.com "sudo nginx -t ; sudo service nginx reload"

##

.PHONY: list-hosts
list-hosts:
	@echo "#### start of badssl.test hosts ####"
	@grep -r "server_name.*{{ site.domain }}" . \
		| sed "s/.*server_name \([^\{]*\).*/127.0.0.1 \1badssl.test/g" \
		| sort \
		| uniq \
		| grep -v "\*"
	@echo "#### end of badssl.test hosts ####"
