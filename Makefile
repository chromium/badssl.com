all: build

SITE = badssl.com
URL = "https://${SITE}/"


.PHONY: deploy
deploy:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		./ \
		${SITE}:~/${SITE}/
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: open
open:
	open "${URL}"
