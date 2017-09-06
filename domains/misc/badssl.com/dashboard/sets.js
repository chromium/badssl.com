
var sets = [
  {
    heading: "Not Secure",
    success: "no",
    fail: "yes",
    subdomains: [
      {subdomain: "expired"},
      {subdomain: "wrong.host"},
      {subdomain: "self-signed"},
      {subdomain: "untrusted-root"},

      {subdomain: "sha1-intermediate"},
      {subdomain: "rc4"},
      {subdomain: "rc4-md5"},
      {subdomain: "dh480"},
      {subdomain: "dh512"},
      {subdomain: "dh1024"},
      {subdomain: "superfish"},
      {subdomain: "edellroot"},
      {subdomain: "dsdtestprovider"},
      {subdomain: "preact-cli"},
      {subdomain: "webpack-dev-server"},
      {subdomain: "null"}
    ]
  },
  {
    heading: "Bad Certificates",
    success: "maybe",
    fail: "yes",
    subdomains: [
      {subdomain: "revoked"},
      {subdomain: "pinning-test"},
      {subdomain: "invalid-expected-sct"}
    ]
  },
  {
    heading: "Legacy",
    success: "maybe",
    fail: "yes",
      subdomains: [
      {subdomain: "tls-v1-0", port: 1010},
      {subdomain: "tls-v1-1", port: 1011},
      {subdomain: "cbc"},
      {subdomain: "3des"}
    ]
  },
  {
    heading: "Secure",
    success: "yes",
    fail: "no",
    subdomains: [
      {subdomain: "sha256"},
      {subdomain: "sha384"},
      {subdomain: "sha512"},
      {subdomain: "rsa2048"},
      {subdomain: "ecc256"},
      {subdomain: "ecc384"},
      {subdomain: "mozilla-modern"}
    ]
  },
  {
    heading: "Secure but Weird",
    success: "yes",
    fail: "maybe",
      subdomains: [
      {subdomain: "1000-sans"},
      {subdomain: "10000-sans"},
      {subdomain: "rsa8192"},
      {subdomain: "no-subject"},
      {subdomain: "no-common-name"},
      {subdomain: "incomplete-chain"}
    ]
  }
];
