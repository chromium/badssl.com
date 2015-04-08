# [`badssl.com`](https://badssl.com)

- [Chrome](https://support.google.com/chrome/answer/6098869?hl=en): `Your connection is not private`
- [Firefox](https://support.mozilla.org/en-US/kb/connection-untrusted-error-message): `This Connection is Untrusted`
- Safari: `Safari can't verify the identity of the website "badssl.com".`
- [Opera](http://help.opera.com/Mac/12.10/en/certificates.html): `Invalid Certificate`
- [Internet Explorer](http://support.microsoft.com/en-us/kb/931850): `There is a problem with this website’s security certificate.`


## Server Setup

Stock Ubuntu VM, DNS A records for `badssl.com.` and `*.badssl.com.` pointing to the VM.

Push the code into `~/badssl/` on the server:

    make deploy

Set up nginx on the server:

    sudo apt-get update
    sudo apt-get install nginx

    # Link repo into /var/www
    sudo ln -s "${HOME}/badssl" /var/www/badssl

    sudo ln -s /var/www/badssl/config/nginx.conf /etc/nginx/sites-available/badssl
    sudo ln -s /etc/nginx/sites-available/badssl /etc/nginx/sites-enabled/badssl

    # Make sure the actual keys are in /var/www/badssl/keys/
    sudo service nginx restart

