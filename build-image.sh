#!/bin/bash
set -e

VERSION=$(grep '<version>' pom.xml | head -n 2 | tail -n 1 | sed -e 's|<version>||g' -e 's|</version>||g' -e 's| ||g')

mkdir blog-frontend-server/target/jar
cp blog-frontend-server/target/*.jar blog-frontend-server/target/jar
pack build making/blog-frontend:${VERSION} -p blog-frontend-server/target/jar --builder cloudfoundry/cnb:bionic --publish