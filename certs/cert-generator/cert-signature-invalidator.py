#!/usr/bin/env python

import sys

# Because actually parsing X.509/ASN.1 is for chumpy-chumps

if len(sys.argv) != 2:
    print sys.argv[0] + ' <certificate to corrupt>'
    sys.exit(1)

with open(sys.argv[1], 'rb+') as certf:
    # Seek to the last part of the cert that's not padded with '='
    certf.seek(-28, 2)
    while certf.read(1) == '=':
        certf.seek(-2, 1)

    # Then seek back 5 from the cursor position of the last read
    certf.seek(-6, 1)

    # Make sure we're not on a line ending
    while certf.read(1) in ('\r', '\n'):
        certf.seek(-2, 1)
    certf.seek(-1, 1)

    # Read in that value
    value = certf.read(1)
    certf.seek(-1, 1)

    # And overwrite it
    certf.write('0') if value != '0' else certf.write('1')
