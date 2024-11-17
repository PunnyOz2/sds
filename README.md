<!-- sudo docker buildx build --push --platform linux/arm/v7,linux/arm64/v8,linux/amd64 -t punnyoz/frontend . -->

# Kubernetes Cluster Setup and Application Deployment

This guide provides step-by-step instructions to set up a Kubernetes cluster and deploy the WebRTC signaling server and streaming application using K3s and STUNner. It is tailored for a K3s cluster running on Raspberry Pi nodes.

## Prerequisites

Before proceeding, ensure you have the following:

**Hardware**: 4 Raspberry Pi nodes running Debian
**Cluster**: K3s installed and configured (see below)
**Network**: Ensure all nodes are on the same network and can communicate
**Tools**:

- K3s
- kubectl
- Helm
- SSH access to Raspberry Pi nodes
- A configured STUNner gateway

## K3s Cluster Setup

Step 1: Install K3s

Install K3s on the master node:
            
```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable=traefik --flannel-backend=host-gw --tls-san=<master-node-ip> --bind-address=<master-node-ip> --advertise-address=<master-node-ip> --node-ip=<master-node-ip> --cluster-init" sh -s -
```

Step 2: Get the K3s token

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

Step 3: Join the worker nodes

Run the following command on each worker node:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<master-node-ip>:6443 K3S_TOKEN="token" sh -
```

Step 4: Verify the cluster

```bash
kubectl get nodes
```

Step 5: Set up firewall rules

```bash
sudo iptables -A INPUT -p tcp --dport 6443 -j ACCEPT (On master)
sudo iptables -A INPUT -p tcp --dport 3478 -j ACCEPT (On master and worker nodes)
```

Step 6: Save the iptables rules on each node

```bash
sudo iptables-save > /etc/iptables/rules.v4
```

# Application Deployment

Step 1: Clone the repository

```bash
git clone https://github.com/PunnyOz2/sds-finalproject.git
```

Step 2: Install nginx-ingress

```bash
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

Step 3: Install STUNner and create stunner namespace

```bash
helm install stunner-gateway-operator stunner/stunner-gateway-operator --create-namespace --namespace=stunner-system
kubectl create namespace stunner
```

Step 4: Deploy all resources

```bash
kubectl apply -f -R sds-finalproject/k8s
```

*you may also need to change the CORS_ALLOWED_ORIGINS in the backend deployment to the IP of the ingress controller

Step 5: Verify the deployment

```bash
kubectl get pods -n stunner
kubectl get pods -n default
```

Step 6: Access the application using the Ingress IP (http://(ingress-ip)/streaming)

```bash
kubectl get svc -n ingress-nginx
```

Good luck!
