
var sets = [
  {
    heading: "Certificate Validation (High Risk)",
    description: "If your browser connects to one of these sites, it could be very easy for an attacker to see and modify everything on web sites that you visit.",
    success: "no",
    fail: "yes",
    subdomains: [
      {subdomain: "expired"},
      {subdomain: "wrong.host"},
      {subdomain: "self-signed"},
      {subdomain: "untrusted-root"}
    ]
  },
  {
    heading: "Interception Certificates (High Risk)",
    description: "If your browser connects to one of these sites, it could be very easy for an attacker to see and modify everything on web sites that you visit. This may be due to interception software installed on your device.",
    success: "no",
    fail: "yes",
    subdomains: [
      {subdomain: "superfish"},
      {subdomain: "edellroot"},
      {subdomain: "dsdtestprovider"},
      {subdomain: "preact-cli"},
      {subdomain: "webpack-dev-server"}
    ]
  },
  {
    heading: "Broken Cryptography (Medium Risk)",
    description: "If your browser connects to one of these sites, an attacker with enough resources may be able to see and/or modify everything on web sites that you visit. This is because your browser supports connections settings that are outdated and known to have significant security flaws.",
    success: "no",
    fail: "yes",
    subdomains: [
      {subdomain: "sha1-intermediate"},
      {subdomain: "rc4"},
      {subdomain: "rc4-md5"},
      {subdomain: "dh480"},
      {subdomain: "dh512"},
      {subdomain: "dh1024"},
      {subdomain: "null"}
    ]
  },
  {
    heading: "Legacy Cryptography (Moderate Risk)",
    description: "If your browser connects to one of these sites, your web traffic is probably safe from attackers in the near future. However, your connections to some sites might not be using the strongest possible security. Your browser may use these settings in order to connect to some older sites.",
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
    heading: "Domain Security Policies",
    description: "These are special tests for some specific browsers. These tests may be able to tell whether your browser uses advanced domain security policy mechanisms (HSTS, HPKP, SCT) to detect illegitimate certificates.",
    success: "maybe",
    fail: "yes",
    subdomains: [
      {subdomain: "revoked"},
      {subdomain: "pinning-test"},
      {subdomain: "invalid-expected-sct"}
    ]
  },
  {
    heading: "Secure (Uncommon)",
    description: "These settings are secure. However, they are less common and even if your browser doesn't support them you probably won't have issues with most sites.",
    success: "yes",
    fail: "maybe",
      subdomains: [
      {subdomain: "1000-sans"},
      {subdomain: "10000-sans"},
      {subdomain: "sha384"},
      {subdomain: "sha512"},
      {subdomain: "rsa8192"},
      {subdomain: "no-subject"},
      {subdomain: "no-common-name"},
      {subdomain: "incomplete-chain"}
    ]
  },
  {
    heading: "Secure (Common)",
    description: "These settings are secure and commonly used by sites. Your browser will need to support most of these in order to connect to sites securely.",
    success: "yes",
    fail: "no",
    subdomains: [
      {subdomain: "tls-v1-2", port: 1012},
      {subdomain: "sha256"},
      {subdomain: "rsa2048"},
      {subdomain: "ecc256"},
      {subdomain: "ecc384"},
      {subdomain: "extended-validation"},
      {subdomain: "mozilla-modern"}
    ]
  }
];
