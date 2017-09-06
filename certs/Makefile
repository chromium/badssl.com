# chain     :: pem <= []crt
# dhparam   :: pem <= int (#bits)
# gen-ca    :: crt <= conf, key
# gen-csr   :: csr <= conf, key
# gen-key    :: key <= int (#bits)
# gen-ecckey :: key <= string (ECC Prime)
# self-sign :: crt <= days, hash, extensions, conf, csr, key (self)
# sign      :: crt <= days, hash, extensions, conf, csr, key (CA), crt (CA)

# TODO:
# Generate the expired cert in the past.

# Note: Files and paths must not contain spaces.

D = badssl.com
MAIN_CERT_TYPE = rsa2048
DAYS_DEFAULT = 730
HASH_DEFAULT = sha256

SIGN_CA_DEFAULTS = 3650 $(HASH_DEFAULT) req_v3_ca
SIGN_LEAF_DEFAULTS = $(DAYS_DEFAULT) $(HASH_DEFAULT) req_v3_usr

# These variables will keep track of all chain targets.
CHAINS_PROD =
# These are chains that we can't get public versions of (usually due to Baseline Requirements).
CHAINS_LOCAL_ONLY =

O = sets/test

.PHONY: all
all: test

.PHONY: test
test: prod chains-local

.PHONY: prod
prod: chains-prod dhparams

.PHONY: clean
clean:
	rm -rf $(O)/gen

################################
$(O)/gen/key/ca-root.key:
	./tool gen-key $@ $(D) 4096
$(O)/gen/crt/ca-root.crt: src/conf/ca-root.conf $(O)/gen/key/ca-root.key
	./tool gen-ca $@ $(D) $^

################################
$(O)/gen/key/ca-untrusted-root.key:
	./tool gen-key $@ $(D) 4096
$(O)/gen/crt/ca-untrusted-root.crt: src/conf/ca-untrusted-root.conf $(O)/gen/key/ca-untrusted-root.key
	./tool gen-ca $@ $(D) $^

################################
$(O)/gen/key/ca-intermediate.key:
	./tool gen-key $@ $(D) 4096
$(O)/gen/csr/ca-intermediate.csr: src/conf/ca-intermediate.conf $(O)/gen/key/ca-intermediate.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/ca-intermediate.crt: src/conf/ca-intermediate.conf $(O)/gen/csr/ca-intermediate.csr $(O)/gen/key/ca-root.key $(O)/gen/crt/ca-root.crt
	./tool sign $@ $(D) $(SIGN_CA_DEFAULTS) $^

################################
$(O)/gen/key/ca-sha1-intermediate.key:
	./tool gen-key $@ $(D) 4096
$(O)/gen/csr/ca-sha1-intermediate.csr: src/conf/ca-intermediate.conf $(O)/gen/key/ca-sha1-intermediate.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/ca-sha1-intermediate.crt: src/conf/ca-intermediate.conf $(O)/gen/csr/ca-sha1-intermediate.csr $(O)/gen/key/ca-root.key $(O)/gen/crt/ca-root.crt
	./tool sign $@ $(D) 3650 sha1 req_v3_ca $^

################################
$(O)/gen/key/leaf-main.key: $(O)/gen/key/leaf-$(MAIN_CERT_TYPE).key
	cp $< $@
$(O)/gen/csr/wildcard-main.csr: $(O)/gen/csr/wildcard-$(MAIN_CERT_TYPE).csr
	cp $< $@
$(O)/gen/crt/wildcard-main.crt: $(O)/gen/crt/wildcard-$(MAIN_CERT_TYPE).crt
	cp $< $@

################################
$(O)/gen/csr/fallback.csr: src/conf/fallback.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/fallback.crt: src/conf/fallback.conf $(O)/gen/csr/fallback.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/fallback.pem
$(O)/gen/chain/fallback.pem: $(O)/gen/crt/fallback.crt
	./tool chain $@ $(D) $^

################################
CHAINS_PROD += $(O)/gen/chain/wildcard-incomplete-chain.pem
$(O)/gen/chain/wildcard-incomplete-chain.pem: $(O)/gen/crt/wildcard-main.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-sha1-2016.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	# TODO: date calculations
	./tool sign $@ $(D) 10 sha1 req_v3_usr $^
CHAINS_PROD += $(O)/gen/chain/wildcard-sha1-2016.pem
$(O)/gen/chain/wildcard-sha1-2016.pem: $(O)/gen/crt/wildcard-sha1-2016.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-sha1-2017.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	# TODO: date calculations
	./tool sign $@ $(D) 200 sha1 req_v3_usr $^
CHAINS_PROD += $(O)/gen/chain/wildcard-sha1-2017.pem
$(O)/gen/chain/wildcard-sha1-2017.pem: $(O)/gen/crt/wildcard-sha1-2017.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-sha1-intermediate.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-sha1-intermediate.key $(O)/gen/crt/ca-sha1-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-sha1-intermediate.pem
$(O)/gen/chain/wildcard-sha1-intermediate.pem: $(O)/gen/crt/wildcard-sha1-intermediate.crt $(O)/gen/crt/ca-sha1-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-md5.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(DAYS_DEFAULT) md5 req_v3_usr $^
CHAINS_PROD += $(O)/gen/chain/wildcard-md5.pem
$(O)/gen/chain/wildcard-md5.pem: $(O)/gen/crt/wildcard-md5.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-sha384.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(DAYS_DEFAULT) sha384 req_v3_usr $^
CHAINS_PROD += $(O)/gen/chain/wildcard-sha384.pem
$(O)/gen/chain/wildcard-sha384.pem: $(O)/gen/crt/wildcard-sha384.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-sha512.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(DAYS_DEFAULT) sha512 req_v3_usr $^
CHAINS_PROD += $(O)/gen/chain/wildcard-sha512.pem
$(O)/gen/chain/wildcard-sha512.pem: $(O)/gen/crt/wildcard-sha512.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-expired.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	# Too lazy to setup the loathsome mess that is openssl ca when I could just wait a day
	./tool sign $@ $(D) 1 sha256 req_v3_usr $^
CHAINS_PROD += $(O)/gen/chain/wildcard-expired.pem
$(O)/gen/chain/wildcard-expired.pem: $(O)/gen/crt/wildcard-expired.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-untrusted-root.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/ca-untrusted-root.key $(O)/gen/crt/ca-untrusted-root.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-untrusted-root.pem
$(O)/gen/chain/wildcard-untrusted-root.pem: $(O)/gen/crt/wildcard-untrusted-root.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/crt/wildcard-self-signed.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-main.csr $(O)/gen/key/leaf-main.key
	./tool self-sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-self-signed.pem
$(O)/gen/chain/wildcard-self-signed.pem: $(O)/gen/crt/wildcard-self-signed.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-rsa512.key:
	./tool gen-key $@ $(D) 512
$(O)/gen/csr/wildcard-rsa512.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-rsa512.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-rsa512.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-rsa512.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_LOCAL_ONLY += $(O)/gen/chain/wildcard-rsa512.pem
$(O)/gen/chain/wildcard-rsa512.pem: $(O)/gen/crt/wildcard-rsa512.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-rsa1024.key:
	./tool gen-key $@ $(D) 1024
$(O)/gen/csr/wildcard-rsa1024.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-rsa1024.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-rsa1024.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-rsa1024.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_LOCAL_ONLY += $(O)/gen/chain/wildcard-rsa1024.pem
$(O)/gen/chain/wildcard-rsa1024.pem: $(O)/gen/crt/wildcard-rsa1024.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-rsa2048.key:
	./tool gen-key $@ $(D) 2048
$(O)/gen/csr/wildcard-rsa2048.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-rsa2048.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-rsa2048.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-rsa2048.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-rsa2048.pem
$(O)/gen/chain/wildcard-rsa2048.pem: $(O)/gen/crt/wildcard-rsa2048.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-rsa3072.key:
	./tool gen-key $@ $(D) 3072
$(O)/gen/csr/wildcard-rsa3072.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-rsa3072.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-rsa3072.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-rsa3072.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_LOCAL_ONLY += $(O)/gen/chain/wildcard-rsa3072.pem
$(O)/gen/chain/wildcard-rsa3072.pem: $(O)/gen/crt/wildcard-rsa3072.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-rsa8192.key:
	./tool gen-key $@ $(D) 8192
$(O)/gen/csr/wildcard-rsa8192.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-rsa8192.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-rsa8192.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-rsa8192.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-rsa8192.pem
$(O)/gen/chain/wildcard-rsa8192.pem: $(O)/gen/crt/wildcard-rsa8192.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-ecc256.key:
	./tool gen-ecckey $@ $(D) prime256v1
$(O)/gen/csr/wildcard-ecc256.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-ecc256.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-ecc256.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-ecc256.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-ecc256.pem
$(O)/gen/chain/wildcard-ecc256.pem: $(O)/gen/crt/wildcard-ecc256.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-ecc384.key:
	./tool gen-ecckey $@ $(D) secp384r1
$(O)/gen/csr/wildcard-ecc384.csr: src/conf/wildcard.conf $(O)/gen/key/leaf-ecc384.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/wildcard-ecc384.crt: src/conf/wildcard.conf $(O)/gen/csr/wildcard-ecc384.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/wildcard-ecc384.pem
$(O)/gen/chain/wildcard-ecc384.pem: $(O)/gen/crt/wildcard-ecc384.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-no-common-name.csr: src/conf/subdomain-no-common-name.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-no-common-name.crt: src/conf/subdomain-no-common-name.conf $(O)/gen/csr/subdomain-no-common-name.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-no-common-name.pem
$(O)/gen/chain/subdomain-no-common-name.pem: $(O)/gen/crt/subdomain-no-common-name.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-no-san.csr: src/conf/subdomain-no-san.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-no-san.crt: src/conf/subdomain-no-san.conf $(O)/gen/csr/subdomain-no-san.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_LOCAL_ONLY += $(O)/gen/chain/subdomain-no-san.pem
$(O)/gen/chain/subdomain-no-san.pem: $(O)/gen/crt/subdomain-no-san.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-no-subject.csr: src/conf/subdomain-no-subject.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr-no-subject $@ $(D) $^
$(O)/gen/crt/subdomain-no-subject.crt: src/conf/subdomain-no-subject.conf $(O)/gen/csr/subdomain-no-subject.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-no-subject.pem
$(O)/gen/chain/subdomain-no-subject.pem: $(O)/gen/crt/subdomain-no-subject.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-1000-sans.csr: src/conf/subdomain-1000-sans.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-1000-sans.crt: src/conf/subdomain-1000-sans.conf $(O)/gen/csr/subdomain-1000-sans.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-1000-sans.pem
$(O)/gen/chain/subdomain-1000-sans.pem: $(O)/gen/crt/subdomain-1000-sans.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-10000-sans.csr: src/conf/subdomain-10000-sans.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-10000-sans.crt: src/conf/subdomain-10000-sans.conf $(O)/gen/csr/subdomain-10000-sans.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-10000-sans.pem
$(O)/gen/chain/subdomain-10000-sans.pem: $(O)/gen/crt/subdomain-10000-sans.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-xn--n1aae7f7o.csr: src/conf/subdomain-xn--n1aae7f7o.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-xn--n1aae7f7o.crt: src/conf/subdomain-xn--n1aae7f7o.conf $(O)/gen/csr/subdomain-xn--n1aae7f7o.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-xn--n1aae7f7o.pem
$(O)/gen/chain/subdomain-xn--n1aae7f7o.pem: $(O)/gen/crt/subdomain-xn--n1aae7f7o.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
# Note: this is just a regular cert in `test`.
# Getting a real-world cert without SCTs may be extra work in the future.
$(O)/gen/csr/subdomain-preloaded-expect-ct.csr: src/conf/subdomain-preloaded-expect-ct.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-preloaded-expect-ct.crt: src/conf/subdomain-preloaded-expect-ct.conf $(O)/gen/csr/subdomain-preloaded-expect-ct.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-preloaded-expect-ct.pem
$(O)/gen/chain/subdomain-preloaded-expect-ct.pem: $(O)/gen/crt/subdomain-preloaded-expect-ct.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
# Note: this is just a regular cert in `test`
$(O)/gen/csr/subdomain-invalid-expected-sct.csr: src/conf/subdomain-invalid-expected-sct.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-invalid-expected-sct.crt: src/conf/subdomain-invalid-expected-sct.conf $(O)/gen/csr/subdomain-invalid-expected-sct.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-invalid-expected-sct.pem
$(O)/gen/chain/subdomain-invalid-expected-sct.pem: $(O)/gen/crt/subdomain-invalid-expected-sct.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-superfish.csr: src/conf/subdomain-superfish.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-superfish.crt: src/conf/subdomain-superfish.conf $(O)/gen/csr/subdomain-superfish.csr src/key/ca-superfish.key src/crt/ca-superfish.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-superfish.pem
$(O)/gen/chain/subdomain-superfish.pem: $(O)/gen/crt/subdomain-superfish.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-mitm-software.csr: src/conf/subdomain-mitm-software.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-mitm-software.crt: src/conf/subdomain-mitm-software.conf $(O)/gen/csr/subdomain-mitm-software.csr src/key/ca-mitm-software.key src/crt/ca-mitm-software.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-mitm-software.pem
$(O)/gen/chain/subdomain-mitm-software.pem: $(O)/gen/crt/subdomain-mitm-software.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-edellroot.csr: src/conf/subdomain-edellroot.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-edellroot.crt: src/conf/subdomain-edellroot.conf $(O)/gen/csr/subdomain-edellroot.csr src/key/ca-edellroot.key src/crt/ca-edellroot.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-edellroot.pem
$(O)/gen/chain/subdomain-edellroot.pem: $(O)/gen/crt/subdomain-edellroot.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-dsdtestprovider.csr: src/conf/subdomain-dsdtestprovider.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-dsdtestprovider.crt: src/conf/subdomain-dsdtestprovider.conf $(O)/gen/csr/subdomain-dsdtestprovider.csr src/key/ca-dsdtestprovider.key src/crt/ca-dsdtestprovider.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-dsdtestprovider.pem
$(O)/gen/chain/subdomain-dsdtestprovider.pem: $(O)/gen/crt/subdomain-dsdtestprovider.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-preact-cli.csr: src/conf/subdomain-preact-cli.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-preact-cli.crt: src/conf/subdomain-preact-cli.conf $(O)/gen/csr/subdomain-preact-cli.csr src/key/ca-preact-cli.key src/crt/ca-preact-cli.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-preact-cli.pem
$(O)/gen/chain/subdomain-preact-cli.pem: $(O)/gen/crt/subdomain-preact-cli.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/csr/subdomain-webpack-dev-server.csr: src/conf/subdomain-webpack-dev-server.conf $(O)/gen/key/leaf-main.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-webpack-dev-server.crt: src/conf/subdomain-webpack-dev-server.conf $(O)/gen/csr/subdomain-webpack-dev-server.csr src/key/ca-webpack-dev-server.key src/crt/ca-webpack-dev-server.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-webpack-dev-server.pem
$(O)/gen/chain/subdomain-webpack-dev-server.pem: $(O)/gen/crt/subdomain-webpack-dev-server.crt
	./tool chain $@ $(D) $^

################################
$(O)/gen/key/leaf-revoked.key:
	./tool gen-key $@ $(D) 2048

################################
$(O)/gen/csr/subdomain-revoked.csr: src/conf/subdomain-revoked.conf $(O)/gen/key/leaf-revoked.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-revoked.crt: src/conf/subdomain-revoked.conf $(O)/gen/csr/subdomain-revoked.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-revoked.pem
$(O)/gen/chain/subdomain-revoked.pem: $(O)/gen/crt/subdomain-revoked.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^


################################
$(O)/gen/key/leaf-captive-portal.key:
	./tool gen-key $@ $(D) 2048

################################
$(O)/gen/csr/subdomain-captive-portal.csr: src/conf/subdomain-captive-portal.conf $(O)/gen/key/leaf-captive-portal.key
	./tool gen-csr $@ $(D) $^
$(O)/gen/crt/subdomain-captive-portal.crt: src/conf/subdomain-captive-portal.conf $(O)/gen/csr/subdomain-captive-portal.csr $(O)/gen/key/ca-intermediate.key $(O)/gen/crt/ca-intermediate.crt
	./tool sign $@ $(D) $(SIGN_LEAF_DEFAULTS) $^
CHAINS_PROD += $(O)/gen/chain/subdomain-captive-portal.pem
$(O)/gen/chain/subdomain-captive-portal.pem: $(O)/gen/crt/subdomain-captive-portal.crt $(O)/gen/crt/ca-intermediate.crt
	./tool chain $@ $(D) $^


################################
$(O)/gen/dhparam/dh480.pem:
	./tool dhparam $@ $(D) 480
$(O)/gen/dhparam/dh512.pem:
	./tool dhparam $@ $(D) 512
$(O)/gen/dhparam/dh1024.pem:
	./tool dhparam $@ $(D) 1024
$(O)/gen/dhparam/dh2048.pem:
	./tool dhparam $@ $(D) 2048
$(O)/gen/dhparam/dh-composite.pem: src/dhparam/dh-composite.pem
	cp $^ $@
$(O)/gen/dhparam/dh-small-subgroup.pem: src/dhparam/dh-small-subgroup.pem
	cp $^ $@

################################
.PHONY: chains-prod
chains-prod: $(CHAINS_PROD)

.PHONY: chains-local
chains-local: chains-prod $(CHAINS_LOCAL_ONLY)

.PHONY: dhparams
dhparams: $(O)/gen/dhparam/dh480.pem $(O)/gen/dhparam/dh512.pem $(O)/gen/dhparam/dh1024.pem $(O)/gen/dhparam/dh2048.pem $(O)/gen/dhparam/dh-composite.pem $(O)/gen/dhparam/dh-small-subgroup.pem
