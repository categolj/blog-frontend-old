#!/bin/bash
set -e

VERSION=$(grep '<version>' pom.xml | head -n 2 | tail -n 1 | sed -e 's|<version>||g' -e 's|</version>||g' -e 's| ||g')

pack build making/blog-frontend:${VERSION} \
  -p  blog-frontend-server/target/blog-frontend-server-*.jar \
  --builder making/java-cnb-builder \
  --publish
