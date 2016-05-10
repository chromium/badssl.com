#!/usr/bin/env bash

# Defense is the best offense
set -eu
cd "$(dirname ${0})"
cd ..

# Quit if the symlinks or files are already here
if [[ -f wildcard.normal.pem ]]; then
  echo "hmm"
  exit
fi

# Let's go up a directory and create all the symlinks downwards
for i in `ls cert-chains`; do
  ln -s cert-chains/$i $i
done
