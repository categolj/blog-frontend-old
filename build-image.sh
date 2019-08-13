#!/bin/bash
set -e

VERSION=$(grep '<version>' pom.xml | head -n 2 | tail -n 1 | sed -e 's|<version>||g' -e 's|</version>||g' -e 's| ||g')

mkdir -p blog-frontend-server/target/jar
cp blog-frontend-server/target/*.jar blog-frontend-server/target/jar
pack build making/blog-frontend:${VERSION} -p blog-frontend-server/target/jar --publish \
  --buildpack org.cloudfoundry.archiveexpanding,io.pivotal.openjdk,org.cloudfoundry.jvmapplication,org.cloudfoundry.springboot,org.cloudfoundry.distzip