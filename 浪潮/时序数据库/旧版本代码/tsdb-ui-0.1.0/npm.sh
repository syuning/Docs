npm config set registry http://repo.inspur.com:80/artifactory/api/npm/iop-npm-virtual/

cd src/app/frontend/tsdb
npm version patch
npm publish
