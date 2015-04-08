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
		./ \
		badssl.com:~/badssl/
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: nginx
nginx:
	ssh -i ${HOME}/.ssh/google_compute_engine badssl.com "sudo service nginx reload"

.PHONY: open
open:
	open "${URL}"
