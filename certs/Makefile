# chain     :: pem <= []crt
# dhparam   :: pem <= int (#bits)
# gen-ca    :: crt <= conf, key
# gen-csr   :: csr <= conf, key
# genrsa    :: key <= int (#bits)
# self-sign :: crt <= days, hash, extensions, conf, csr, key (self)
# sign      :: crt <= days, hash, extensions, conf, csr, key (CA), crt (CA)

# TODO:
# Generate the expired cert in the past.

# Note: Files and paths must not contain spaces.

DOMAIN = badssl.com
DAYS_DEFAULT = 730
HASH_DEFAULT = sha256

SIGN_CA_DEFAULTS = $(DOMAIN) 3650 $(HASH_DEFAULT) req_v3_ca
SIGN_LEAF_DEFAULTS = $(DOMAIN) $(DAYS_DEFAULT) $(HASH_DEFAULT) req_v3_usr

# These variables will keep track of all chain targets.
CHAINS =

.PHONY: all
all: chains dhparams

.PHONY: clean
clean:
	rm -rf gen
	rm -f src/crt/*.srl

################################
gen/key/ca-root.key:
	tools/genrsa $@ $(DOMAIN) 4096
gen/crt/ca-root.crt: src/conf/ca-root.conf gen/key/ca-root.key
	tools/gen-ca $@ $(DOMAIN) $^

################################
gen/key/ca-intermediate.key:
	tools/genrsa $@ $(DOMAIN) 4096
gen/csr/ca-intermediate.csr: src/conf/ca-intermediate.conf gen/key/ca-intermediate.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/ca-intermediate.crt: src/conf/ca-intermediate.conf gen/csr/ca-intermediate.csr gen/key/ca-root.key gen/crt/ca-root.crt
	tools/sign $@ $(SIGN_CA_DEFAULTS) $^

################################
gen/key/leaf-main.key:
	tools/genrsa $@ $(DOMAIN) 2048

################################
gen/csr/wildcard-main.csr: src/conf/wildcard-main.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/wildcard-main.crt: src/conf/wildcard-main.conf gen/csr/wildcard-main.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/wildcard-main.pem
gen/chain/wildcard-main.pem: gen/crt/wildcard-main.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/csr/fallback.csr: src/conf/fallback.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/fallback.crt: src/conf/fallback.conf gen/csr/fallback.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/fallback.pem
gen/chain/fallback.pem: gen/crt/fallback.crt
	tools/chain $@ $^

################################
CHAINS += gen/chain/wildcard-incomplete-chain.pem
gen/chain/wildcard-incomplete-chain.pem: gen/crt/wildcard-main.crt
	tools/chain $@ $^

################################
gen/crt/wildcard-sha1-2016.crt: src/conf/wildcard-main.conf gen/csr/wildcard-main.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	# TODO: date calculations
	tools/sign $@ $(DOMAIN) 10 sha1 req_v3_usr $^
CHAINS += gen/chain/wildcard-sha1-2016.pem
gen/chain/wildcard-sha1-2016.pem: gen/crt/wildcard-sha1-2016.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/crt/wildcard-sha1-2017.crt: src/conf/wildcard-main.conf gen/csr/wildcard-main.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	# TODO: date calculations
	tools/sign $@ $(DOMAIN) 200 sha1 req_v3_usr $^
CHAINS += gen/chain/wildcard-sha1-2017.pem
gen/chain/wildcard-sha1-2017.pem: gen/crt/wildcard-sha1-2017.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/crt/wildcard-expired.crt: src/conf/wildcard-main.conf gen/csr/wildcard-main.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	# Too lazy to setup the loathsome mess that is openssl ca when I could just wait a day
	tools/sign $@ $(DOMAIN) 1 sha256 req_v3_usr $^
CHAINS += gen/chain/wildcard-expired.pem
gen/chain/wildcard-expired.pem: gen/crt/wildcard-expired.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/crt/wildcard-self-signed.crt: src/conf/wildcard-main.conf gen/csr/wildcard-main.csr gen/key/leaf-main.key
	tools/self-sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/wildcard-self-signed.pem
gen/chain/wildcard-self-signed.pem: gen/crt/wildcard-self-signed.crt
	tools/chain $@ $^

################################
gen/key/leaf-rsa512.key:
	tools/genrsa $@ $(DOMAIN) 512
gen/csr/wildcard-rsa512.csr: src/conf/wildcard-main.conf gen/key/leaf-rsa512.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/wildcard-rsa512.crt: src/conf/wildcard-main.conf gen/csr/wildcard-rsa512.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/wildcard-rsa512.pem
gen/chain/wildcard-rsa512.pem: gen/crt/wildcard-rsa512.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/key/leaf-rsa1024.key:
	tools/genrsa $@ $(DOMAIN) 1024
gen/csr/wildcard-rsa1024.csr: src/conf/wildcard-main.conf gen/key/leaf-rsa1024.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/wildcard-rsa1024.crt: src/conf/wildcard-main.conf gen/csr/wildcard-rsa1024.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/wildcard-rsa1024.pem
gen/chain/wildcard-rsa1024.pem: gen/crt/wildcard-rsa1024.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/key/leaf-rsa8192.key:
	tools/genrsa $@ $(DOMAIN) 8192
gen/csr/wildcard-rsa8192.csr: src/conf/wildcard-main.conf gen/key/leaf-rsa8192.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/wildcard-rsa8192.crt: src/conf/wildcard-main.conf gen/csr/wildcard-rsa8192.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/wildcard-rsa8192.pem
gen/chain/wildcard-rsa8192.pem: gen/crt/wildcard-rsa8192.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/csr/subdomain-1000-sans.csr: src/conf/subdomain-1000-sans.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/subdomain-1000-sans.crt: src/conf/subdomain-1000-sans.conf gen/csr/subdomain-1000-sans.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/subdomain-1000-sans.pem
gen/chain/subdomain-1000-sans.pem: gen/crt/subdomain-1000-sans.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/csr/subdomain-10000-sans.csr: src/conf/subdomain-10000-sans.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/subdomain-10000-sans.crt: src/conf/subdomain-10000-sans.conf gen/csr/subdomain-10000-sans.csr gen/key/ca-intermediate.key gen/crt/ca-intermediate.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/subdomain-10000-sans.pem
gen/chain/subdomain-10000-sans.pem: gen/crt/subdomain-10000-sans.crt gen/crt/ca-intermediate.crt
	tools/chain $@ $^

################################
gen/csr/subdomain-superfish.csr: src/conf/subdomain-superfish.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/subdomain-superfish.crt: src/conf/subdomain-superfish.conf gen/csr/subdomain-superfish.csr src/key/ca-superfish.key src/crt/ca-superfish.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/subdomain-superfish.pem
gen/chain/subdomain-superfish.pem: gen/crt/subdomain-superfish.crt
	tools/chain $@ $^

################################
gen/csr/subdomain-edellroot.csr: src/conf/subdomain-edellroot.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/subdomain-edellroot.crt: src/conf/subdomain-edellroot.conf gen/csr/subdomain-edellroot.csr src/key/ca-edellroot.key src/crt/ca-edellroot.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/subdomain-edellroot.pem
gen/chain/subdomain-edellroot.pem: gen/crt/subdomain-edellroot.crt
	tools/chain $@ $^

################################
gen/csr/subdomain-dsdtestprovider.csr: src/conf/subdomain-dsdtestprovider.conf gen/key/leaf-main.key
	tools/gen-csr $@ $(DOMAIN) $^
gen/crt/subdomain-dsdtestprovider.crt: src/conf/subdomain-dsdtestprovider.conf gen/csr/subdomain-dsdtestprovider.csr src/key/ca-dsdtestprovider.key src/crt/ca-dsdtestprovider.crt
	tools/sign $@ $(SIGN_LEAF_DEFAULTS) $^
CHAINS += gen/chain/subdomain-dsdtestprovider.pem
gen/chain/subdomain-dsdtestprovider.pem: gen/crt/subdomain-dsdtestprovider.crt
	tools/chain $@ $^

################################
gen/dhparam/dh480.pem:
	tools/dhparam  $@ 480
gen/dhparam/dh512.pem:
	tools/dhparam  $@ 512
gen/dhparam/dh1024.pem:
	tools/dhparam $@ 1024
gen/dhparam/dh2048.pem:
	tools/dhparam $@ 2048
gen/dhparam/dh-composite.pem: src/dhparam/dh-composite.pem
	cp $^ $@
gen/dhparam/dh-small-subgroup.pem: src/dhparam/dh-small-subgroup.pem
	cp $^ $@

################################
.PHONY: chains
chains: $(CHAINS)

.PHONY: dhparams
dhparams: gen/dhparam/dh480.pem gen/dhparam/dh512.pem gen/dhparam/dh1024.pem gen/dhparam/dh2048.pem gen/dhparam/dh-composite.pem gen/dhparam/dh-small-subgroup.pem
