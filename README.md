<center>
  <a href="https://badssl.com/">
    <img src="./badssl.png" width="472" />
  </a>
</center>

Visit [`badssl.com`](https://badssl.com/) for a list of test subdomains, including:

- [`self-signed.badssl.com`](https://self-signed.badssl.com)
- [`expired.badssl.com`](https://expired.badssl.com)
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

## Acknowledgments

badssl.com is hosted on Google Cloud infrastructure and co-maintained by:

- [April King](https://github.com/april), Mozilla Firefox
- [Lucas Garron](https://github.com/lgarron), Google Chrome

Several public badssl.com certificates required special issuance processes. Most certificates were graciously issued for free, thanks to help from:

- [Vincent Lynch](https://twitter.com/vtlynch), [The SSL Store](https://www.thesslstore.com/) (`sha1-2016`, `sha1-2017`)
- [Richard Barnes](https://twitter.com/rlbarnes), Mozilla (`1000-sans`, `10000-sans`)
- [Clint Wilson](https://twitter.com/clintw_), [DigiCert](https://www.digicert.com/) (most wildcards)
- [Andrew Ayer](https://github.com/agwa), [SSLMate](https://sslmate.com/) (`invalid-expected-sct`)
- [Rob Stradling](https://github.com/robstradling), [Comodo](https://www.comodo.com/) (`1000-sans`, `10000-sans`, `no-subject`, `no-common-name`, `sha1-intermediate`, `ѕрооғ`)

Various subdomains and test pages are also implemented by [external contributors](https://github.com/chromium/badssl.com/graphs/contributors).

## Disclaimer

`badssl.com` is meant for *manual* testing of security UI in web clients.

Most subdomains are likely to have stable functionality, but anything *could* change without notice. If you would like a documented guarantee for a particular use case, please file an issue. (Alternatively, you could make a fork and host your own copy.)

badssl.com is not an official Google product. It is offered "AS-IS" and without any warranties.
