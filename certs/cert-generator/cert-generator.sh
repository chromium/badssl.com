#!/usr/bin/env bash

# Some data generation stuff
d2016=$(date -d '12/31/2016' +%s)
dnow=$(date +%s)
du2016=$(( (d2016-dnow)/(3600*24) ))
du2017=$((du2016+365))

if [ ! -f ../self-signed/badssl-root.pem ]; then
  echo "Generating BadSSL.com Root Certificate Authority"
  openssl req -new -x509 -days 7300 \
    -config badssl-root.conf \
    -out ../self-signed/badssl-root.pem
  echo

  echo "Generating BadSSL.com Intermediate Certificate Authority CSR"
  openssl req -new \
    -out badssl-intermediate.csr \
    -config badssl-intermediate.conf
  echo

  echo "Signing BadSSL.com Intermediate Certificate Authority"
  openssl x509 -req -CAcreateserial -days 3650 -sha256 \
    -in badssl-intermediate.csr \
    -CA ../self-signed/badssl-root.pem \
    -CAkey ../self-signed/badssl-root.key \
    -extfile badssl-intermediate.conf \
    -extensions req_v3_ca \
    -out ../self-signed/badssl-intermediate.pem
  rm badssl-intermediate.csr
  echo
fi

if [ ! -f ../self-signed/badssl.com.key ]; then
  echo "Generating BadSSL.com Private Key"
  openssl genrsa -out ../self-signed/badssl.com.key 2048
  echo
fi

echo "Generating BadSSL Certificate Signing Request"
openssl req -new \
  -key ../self-signed/badssl.com.key \
  -out badssl-wildcard.csr \
  -config badssl-wildcard.conf
echo

echo "Signing BadSSL Default Certificate"
openssl x509 -req -days 730 -sha256 -CAcreateserial \
  -in badssl-wildcard.csr \
  -CA ../self-signed/badssl-intermediate.pem \
  -CAkey ../self-signed/badssl-intermediate.key \
  -extfile badssl-wildcard.conf \
  -extensions req_v3_usr \
  -out out.pem
cat out.pem ../self-signed/badssl-intermediate.pem ../self-signed/badssl-root.pem > ../self-signed/wildcard.normal.pem
echo

echo "Generating incomplete certificate chain"
cp out.pem ../self-signed/wildcard.incomplete-chain.pem
rm out.pem
echo

echo "Signing BadSSL SHA-1 Certificate, expiring 2016"
openssl x509 -req -days $du2016 -sha1 -CAcreateserial \
  -in badssl-wildcard.csr \
  -CA ../self-signed/badssl-intermediate.pem \
  -CAkey ../self-signed/badssl-intermediate.key \
  -extfile badssl-wildcard.conf \
  -extensions req_v3_usr \
  -out out.pem
cat out.pem ../self-signed/badssl-intermediate.pem ../self-signed/badssl-root.pem > ../self-signed/wildcard.sha1-2016.pem
rm out.pem
echo

echo "Signing BadSSL SHA-1 Certificate, expiring 2017"
openssl x509 -req -days $du2017 -sha1 -CAcreateserial \
  -in badssl-wildcard.csr \
  -CA ../self-signed/badssl-intermediate.pem \
  -CAkey ../self-signed/badssl-intermediate.key \
  -extfile badssl-wildcard.conf \
  -extensions req_v3_usr \
  -out out.pem
cat out.pem ../self-signed/badssl-intermediate.pem ../self-signed/badssl-root.pem > ../self-signed/wildcard.sha1-2017.pem
rm out.pem
echo

# Too lazy to setup the loathsome mess that is openssl ca when I could just wait a day
if [ ! -f ../self-signed/wildcard.expired.pem ]
  then
    echo "Signing BadSSL SHA-256 Certificate, expiring tomorrow"
    openssl x509 -req -days 1 -sha256 -CAcreateserial \
      -in badssl-wildcard.csr \
      -CA ../self-signed/badssl-intermediate.pem \
      -CAkey ../self-signed/badssl-intermediate.key \
      -extfile badssl-wildcard.conf \
      -extensions req_v3_usr \
      -out out.pem
    cat out.pem ../self-signed/badssl-intermediate.pem ../self-signed/badssl-root.pem > ../self-signed/wildcard.expired.pem
    rm out.pem
    echo
  else
    echo -e "Not regenerating expiring certificate: delete ../self-signed/wildcard.expired.pem to regenerate\n"
fi

echo "Self-signing BadSSL SHA-256 Certificate"
openssl x509 -req -days 730 -sha256 -CAcreateserial \
  -in badssl-wildcard.csr \
  -signkey ../self-signed/badssl.com.key \
  -extfile badssl-wildcard.conf \
  -extensions req_v3_usr \
  -out out.pem
cp out.pem ../self-signed/wildcard.self-signed.pem
rm out.pem

# Clean up after ourselves
rm badssl-wildcard.csr
