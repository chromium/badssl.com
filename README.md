[![badssl.com](badssl.com.png)](https://badssl.com)

Visit [`badssl.com`](https://badssl.com/) for a list of test subdomains, including:

- [`self-signed.badssl.com`](https://self-signed.badssl.com)
- [`wrong.host.badssl.com`](https://wrong.host.badssl.com)
- [`expired.badssl.com`](https://expired.badssl.com)
- [`incomplete-chain.badssl.com`](https://incomplete-chain.badssl.com)
- [`sha1.badssl.com`](https://sha1.badssl.com)
- [`mixed.badssl.com`](https://mixed.badssl.com)
- [`rc4.badssl.com`](https://rc4.badssl.com)
- [`cbc.badssl.com`](https://cbc.badssl.com)
- [`hsts.badssl.com`](https://hsts.badssl.com)
- [`preloaded-hsts.badssl.com`](https://preloaded-hsts.badssl.com)

## Server Setup

Stock Ubuntu VM, DNS A records for `badssl.com.` and `*.badssl.com.` pointing to the VM.

### Commands

    sudo apt-get update ; sudo apt-get install git nginx
    git clone https://github.com/lgarron/badssl.com && cd badssl.com

    sudo make install
    sudo service nginx restart

### Docker version


    sudo apt-get update ; sudo apt-get install docker.io
    git clone https://github.com/lgarron/badssl.com && cd badssl.com

    sudo docker build --no-cache -t badssl .
    sudo docker run -d -p 80:80 -p 443:443 --name badssl badssl


## Other Browser Security Test Sites

- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [`tls-o-matic.com`](https://www.tls-o-matic.com/)
- [`certificate.revocationcheck.com`](https://certificate.revocationcheck.com/)
- Safe Browsing:
  - [`testsafebrowsing.appspot.com`](https://testsafebrowsing.appspot.com/)
    - Also, separate domains for [phishing](http://phishing.safebrowsingtest.com/) and [uwd](http://uwd.safebrowsingtest.com/).
  - [`testsafebrowsing.appspot.com/chrome`](https://testsafebrowsing.appspot.com/chrome)
- [`rc4.io`](https://rc4.io/)
- [`cert-test.sandbox.google.com`](https://cert-test.sandbox.google.com/) (from the [Google FAQ for Certificate Changes](https://pki.google.com/faq.html)
- [`howsmyssl.com`](https://www.howsmyssl.com/)

Other

- [Runscope Community Projects](https://www.runscope.com/community)
  - [`httpbin.org`](https://httpbin.org/)
  - [`httpstatus.es`](http://httpstatus.es/)

## Use Cases

- [crbug.com/477868](https://code.google.com/p/chromium/issues/detail?id=477868) uses:
  - <https://self-signed.badssl.com/test/imported.js>
