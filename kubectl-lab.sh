#!/bin/bash
set -ex

cmd=$1
shift

ytt \
  -f k8s/namespace.yml \
  -f k8s/certificate.yml \
  -f k8s/app.yml \
  -f k8s/httpproxy.yml \
  -f k8s/pdb.yml \
  -f k8s/secret-frontend.yml \
  -f k8s/overlays/scale-to-one.yml \
  -f k8s/overlays/lab-image.yml \
  -f k8s/overlays/maki-lol.yml \
  | kbld -f - | kubectl ${cmd} -f - $@