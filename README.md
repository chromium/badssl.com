[![badssl.com](badssl.com.png)](https://badssl.com)

Visit [`badssl.com`](https://badssl.com/) for a list of test subdomains, including:

<span style="color: red;">&#x25cf;</span> [`self-signed.badssl.com`](https://self-signed.badssl.com)  
<span style="color: red;">&#x25cf;</span>  [`wrong.host.badssl.com`](https://wrong.host.badssl.com)  
<span style="color: red;">&#x25cf;</span>  [`expired.badssl.com`](https://expired.badssl.com)  
<span style="color: rgb(243, 121, 46);">&#x25cf;</span>  [`incomplete-chain.badssl.com`](https://incomplete-chain.badssl.com)  
<span style="color: rgb(246, 207, 47);">&#x25cf;</span>  [`sha1.badssl.com`](https://sha1.badssl.com)  
<span style="color: rgb(246, 207, 47);">&#x25cf;</span>  [`mixed.badssl.com`](https://mixed.badssl.com)  
<span style="color: gray;">&#x25cf;</span>  [`rc4.badssl.com`](https://rc4.badssl.com)  
<span style="color: gray;">&#x25cf;</span>  [`cbc.badssl.com`](https://cbc.badssl.com)  
<span style="color: green;">&#x25cf;</span>  [`hsts.badssl.com`](https://hsts.badssl.com)  
<span style="color: green;">&#x25cf;</span>  [`preloaded-hsts.badssl.com`](https://preloaded-hsts.badssl.com)

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

    # Make sure the actual keys are in /etc/keys/
    sudo service nginx restart

