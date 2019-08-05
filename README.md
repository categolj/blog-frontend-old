# Blog Frontend


```
kubectl create -n blog secret generic blog-frontend \
  --from-literal=predender-token=${PRERENDER_TOKEN} \
  --dry-run -o yaml > k8s/blog-frontend-secret.yml
```

```
export REACT_APP_BLOG_API=https://blog-api.ik.am
./mvnw clean package -DskipTests=true  && ./build-image.sh 

kbld -f k8s | kubectl apply -f -
```