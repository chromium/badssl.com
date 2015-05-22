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
		--exclude domains/cert/sha1-2017.badssl.com \
		--exclude domains/cert/sha1-2017.badssl.com.conf \
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
