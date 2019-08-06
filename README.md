# Blog Frontend

![image](http://www.plantuml.com/plantuml/png/FOyn3i8m34NtVmeh4moz0gh41LWweGvkRQHAfK5E0WFYxhXgco6Ay_Bqaz-cp9RBSmPEL-FFh7O6ZpaQTKaDMA8eXOV59UiYWRuWkfUfNpSNtcezVeV6hocGAmw4Cm-S7CeGDZJEiGY5cwbvbDgESUHGqroeti9VsP2dmXVvA0DGZHMK2UXIdVSAwwd-hdNP2_u1)


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
