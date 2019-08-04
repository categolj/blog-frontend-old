# Blog Frontend


```
export REACT_APP_BLOG_API=https://blog-api.ik.am

VERSION=$(grep '<version>' pom.xml | head -n 2 | tail -n 1 | sed -e 's|<version>||g' -e 's|</version>||g' -e 's| ||g')
./mvnw clean package -DskipTests=true  && ./build-image.sh && docker push making/blog-frontend:${VERSION}

kbld -f k8s/blog-frontend.yml | kubectl apply -f -
```