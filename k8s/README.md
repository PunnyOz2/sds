# read this before you start

This is how you can run the project on your local machine.

## Steps

1. Connect to the cluster (local, cloud, etc.)
   1. If you are using a local cluster, you can use `minikube` or `kind`.
   2. If you are using a cloud cluster, you can use `gcloud` or `aws`.
        `gcloud container clusters get-credentials deepgi-singapore --region asia-southeast1 --project deepgi-capstone`
2. Check the tools if they are installed (if they exist skip this step)
   1. Install KEDA to the cluster
    `kubectl apply --server-side -f https://github.com/kedacore/keda/releases/download/v2.15.1/keda-2.15.1.yaml`
   2. Install stunner and namespace
    `helm install stunner-gateway-operator stunner/stunner-gateway-operator --create-namespace --namespace=stunner-system`
    `kubectl create namespace stunner`
   3. Install Ingress-Nginx to the cluster plus the regional static IP if doesn't exist
    `gcloud compute addresses create deepgi-regional-ip --region asia-southeast1`
    `helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace --set controller.service.loadBalancerIP=[staticIP]`
3. Apply the necessary resources to the cluster (e.g. `kubectl apply -f .`)