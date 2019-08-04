#!/bin/bash
set -e

VERSION=$(grep '<version>' pom.xml | head -n 2 | tail -n 1 | sed -e 's|<version>||g' -e 's|</version>||g' -e 's| ||g')

docker build ./blog-frontend-server/target -t making/blog-frontend:${VERSION} -f ./Dockerfile --build-arg JAR_FILE=./blog-frontend-server-${VERSION}.jar