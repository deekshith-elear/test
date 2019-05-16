    #!/bin/sh
    #restore certificates
    sudo cp -r /home/ubuntu/test/kube-backup/pki /etc/kubernetes/
    # Restore etcd backup
    sudo mkdir -p /var/lib/etcd
    sudo docker run --rm \
        -v $(pwd)/kube-backup:/backup \
        -v /var/lib/etcd:/var/lib/etcd \
        --env ETCDCTL_API=3 \
        quay.io/coreos/etcd:v3.3.9 \
        /bin/sh -c "etcdctl snapshot restore '/backup/etcd-snapshot-latest.db' ; mv /default.etcd/member/ /var/lib/etcd/"
    # Restore kubeadm-config
    #sudo mkdir /etc/kubeadm
    #sudo cp kube-backup/config.yaml /etc/kubeadm/
    # Initialize the master with backup
    sudo kubeadm init --ignore-preflight-errors=DirAvailable--var-lib-etcd \
        --ignore-preflight-errors=FileContent--proc-sys-net-bridge-bridge-nf-call-iptables \
        --config /home/ubuntu/test/kube-backup/kubeadm-config.yaml
