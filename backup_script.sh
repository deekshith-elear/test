#!/bin/sh    
   # Backup certificates
    sudo cp -r /etc/kubernetes/pki /home/ubuntu/test/kube-backup/
    # Make etcd snapshot
    sudo docker run --rm -v /var/lib/etcd:/home/ubuntu/test/kube-backup \
        --network host \
        -v /etc/kubernetes/pki/etcd:/etc/kubernetes/pki/etcd \
        --env ETCDCTL_API=3 \
        k8s.gcr.io/etcd:3.2.24 \
        etcdctl --endpoints=https://127.0.0.1:2379 \
        --cacert=/etc/kubernetes/pki/etcd/ca.crt \
        --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
        --key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
        snapshot save /home/ubuntu/test/kube-backup/etcd-snapshot-latest.db
    # Backup kubeadm-config
    sudo cp /var/lib/kubelet/config.yaml /home/ubuntu/test/kube-backup
