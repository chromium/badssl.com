<center>
  <a href="https://badssl.com/">
    <img src="./badssl.png" width="472" />
  </a>
</center>

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
    git clone https://github.com/chromium/badssl.com && cd badssl.com

    make list-hosts # list of domains to copy into /etc/hosts
    make test

Now you can visit `badssl.test` in your browser.
The root CA is at `certs/sets/test/gen/crt/ca-root.crt`. If you'd like to preserve it even when you run `make clean`, run:

    cd certs/sets/test
    mkdir -p pregen/crt pregen/key
    cp gen/crt/ca-root.crt pregen/crt/ca-root.crt
    cp gen/key/ca-root.key pregen/key/ca-root.key

## Development setup

When building badssl on a local machine the following steps will be needed.

### Add root cert

    http.badssl.com/certs/badssl-root.pem

### Add host file changes

```
127.0.0.1      badssl.com
127.0.0.1      www.badssl.com
127.0.0.1      expired.badssl.com
127.0.0.1      wrong.host.badssl.com
127.0.0.1      self-signed.badssl.com
127.0.0.1      incomplete-chain.badssl.com
127.0.0.1      sha1.badssl.com
127.0.0.1      mixed.badssl.com
127.0.0.1      rc4.badssl.com
127.0.0.1      cbc.badssl.com
127.0.0.1      hsts.badssl.com
127.0.0.1      preloaded-hsts.badssl.com
127.0.0.1      sha1-2016.badssl.com
127.0.0.1      sha1-2017.badssl.com
127.0.0.1      broken-diffie-hellman.badssl.com
127.0.0.1      weak-diffie-hellman.badssl.com
127.0.0.1      rsa512.badssl.com
127.0.0.1      rsa1024.badssl.com
127.0.0.1      rsa8192.badssl.com
127.0.0.1      ecc.badssl.com
127.0.0.1      sha256.badssl.com
127.0.0.1      dh480.badssl.com
127.0.0.1      dh512.badssl.com
127.0.0.1      dh1024.badssl.com
127.0.0.1      dh2048.badssl.com
127.0.0.1      http.badssl.com
127.0.0.1      dh-small-subgroup.com
127.0.0.1      dh-composite.badssl.com
127.0.0.1      mozilla-modern.badssl.com
127.0.0.1      mozilla-intermediate.badssl.com
127.0.0.1      mozilla-old.badssl.com
127.0.0.1      edellroot.badssl.com
127.0.0.1      superfish.badssl.com
127.0.0.1      dsdtestprovider.badssl.com
```

## Disclaimer

`badssl.com` is meant for *manual* testing of security UI in web clients.

Most subdomains are likely to have stable functionality, but anything *could* change without notice. If you would like a documented guarantee for a particular use case, please file an issue. (Alternatively, you could make a fork and host your own copy.)

badssl.com is not an official Google product. It is offered "AS-IS" and without any warranties.
