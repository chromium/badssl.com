[![badssl.com](badssl.com.png)](https://badssl.com)

Visit [`badssl.com`](https://badssl.com/) for a list of test subdomains, including:

- [`self-signed.badssl.com`](https://self-signed.badssl.com)
- [`expired.badssl.com`](https://expired.badssl.com)
- [`sha1.badssl.com`](https://sha1.badssl.com)
- [`mixed.badssl.com`](https://mixed.badssl.com)
- [`rc4.badssl.com`](https://rc4.badssl.com)
- [`hsts.badssl.com`](https://hsts.badssl.com)

## Server Setup

Stock Ubuntu VM, DNS A records for `badssl.com.` and `*.badssl.com.` pointing to the VM.

### Testing and development

Your user should be part of the `docker` group or otherwise permitted to access Docker.

    sudo apt-get update ; sudo apt-get install docker.io
    git clone https://github.com/lgarron/badssl.com && cd badssl.com

    make list-hosts # list of domains to copy into /etc/hosts
    make docker

Now you can visit `badssl.test` in your browser.
The root CA is at `certs/sets/test/gen/crt/ca-root.crt`. If you'd like to preserve it even when you run `make clean`, run:

    cd certs/sets/test
    mkdir -p pregen/crt
    cp gen/crt/ca-root.crt pregen/crt/ca-root.crt
    mkdir -p pregen/key
    cp gen/key/ca-root.key pregen/key/ca-root.key

## Disclaimer

`badssl.com` is meant for *manual* testing of security UI in web clients.

Most subdomains are likely to have stable functionality, but anything *could* change without notice. If you would like a documented guarantee for a particular use case, please file an issue. (Alternatively, you could make a fork and host your own copy.)

badssl.com is not an official Google product. It is offered "AS-IS" and without any warranties.
