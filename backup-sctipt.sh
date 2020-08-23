#!/bin/bash
if [ "$#" != 3 ]; then
  echo "Error input arguments"
  echo "usage backup-script.sh <source directory> <backup file name> <s3 bucket name>"
  echo "ex: ./backup-script.sh mongodb mongodb-prod elear-backup"                   
  exit 1;
else
  export COMMONDIR=/etc
  cd ${COMMONDIR}
  FILE="${2}.tar.gz" # variable for zip file name
  sudo tar -cvf ${COMMONDIR}/${FILE} ${1}/ # zip src dirctory
  aws s3 cp ${COMMONDIR}/${FILE} s3://${3} # copying to s3 bucket
  rm -rf ${COMMONDIR}/${FILE}
fi
