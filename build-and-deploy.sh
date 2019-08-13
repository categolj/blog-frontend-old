#!/bin/bash
set -e

export REACT_APP_BLOG_API=https://blog-api.ik.am
BOOT_VERSION=$(grep '<version>' pom.xml | head -n 1 | sed -e 's|<version>||g' -e 's|</version>||g' -e 's|<.*>||g' -e 's| ||g')
./mvnw clean package -Dspring-boot.version=${BOOT_VERSION} -DskipTests=true  && ./build-image.sh

kbld -f k8s | kubectl apply -f -