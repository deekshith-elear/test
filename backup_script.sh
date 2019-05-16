#!/bin/sh    
   # Backup certificates
    sudo cp -r /etc/kubernetes/pki /home/ubuntu/test/kube-backup/
    # Make etcd snapshot
    sudo docker run --rm -v $(pwd)/kube-backup:/var/lib/etcd \
        --network host \
        -v /etc/kubernetes/pki/etcd:/etc/kubernetes/pki/etcd \
        --env ETCDCTL_API=3 \
        quay.io/coreos/etcd:v3.3.9 \
        etcdctl --endpoints=https://127.0.0.1:2379 \
        --cacert=/etc/kubernetes/pki/etcd/ca.crt \
        --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
        --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
        snapshot save /var/lib/etcd/etcd-snapshot-latest.db
    # Backup kubeadm-config
    sudo cp /var/lib/kubelet/config.yaml /home/ubuntu/test/kube-backup
