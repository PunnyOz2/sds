root sql password that was hashed: thisisapassword

# Deepgi regional static IP
gcloud compute addresses create deepgi-regional-ip --region asia-southeast2
# Deepgi global static IP
gcloud compute addresses create deepgi-ip --global
# delete static IP
gcloud compute addresses delete deepgi-singapore-regional-ip --region asia-southeast1
# apply keda to kubernetes (using server-side apply)
kubectl apply --server-side -f https://github.com/kedacore/keda/releases/download/v2.15.1/keda-2.15.1.yaml
# apply ingress-nginx to kubernetes
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace --set controller.service.loadBalancerIP=[staticIP]
# apply stunner to kubernetes
helm install stunner-gateway-operator stunner/stunner-gateway-operator --create-namespace --namespace=stunner-system

mysql -u root -p

kubectl exec -it [pod] -- /bin/sh

python3.9 manage.py migrate

# restart deployment
kubectl rollout restart deployment/celery-worker-deployment
kubectl rollout restart deployment/deepgi-backend-deployment

# using fuse to mount google cloud storage (adding account)

kubectl create serviceaccount k8s-service-account --namespace default

gcloud iam service-accounts create deepgi-gke-service-account --project=deepgi-capstone

gcloud projects add-iam-policy-binding deepgi-capstone --member "serviceAccount:deepgi-gke-service-account@deepgi-capstone.iam.gserviceaccount.com" --role "roles/storage.objectUser"

gcloud iam service-accounts add-iam-policy-binding deepgi-gke-service-account@deepgi-capstone.iam.gserviceaccount.com --role roles/iam.workloadIdentityUser --member "serviceAccount:deepgi-capstone.svc.id.goog[default/k8s-service-account]"

kubectl annotate serviceaccount k8s-service-account --namespace default iam.gke.io/gcp-service-account=deepgi-gke-service-account@deepgi-capstone.iam.gserviceaccount.com