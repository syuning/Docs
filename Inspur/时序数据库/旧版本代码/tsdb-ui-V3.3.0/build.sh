#!/bin/bash

cp ./.npmrc  $HOME/
ls -a  $HOME/
npm install -g @angular/cli
npm install -g npm-ci-snapshot
npm install
ng build --prod
cd src/app/frontend/tsdb
pkg_name=`npm view . name`
if [ -z $1 ]
then
   echo "current version is `npm view ${pkg_name} version`"
current_ver=`npm view ${pkg_name} version`
minor=`echo "$current_ver"|sed "s/^.*\.//"`
minor=`expr $minor + 1`
new_ver=`echo "${current_ver}"|sed "s/[0-9]*$/$minor/"`
echo "new_version is ${new_ver}"
  npm version $new_ver
npm publish
fi
if [[ "$1" = "snapshot"||"$1" = "shot"  ]]
then
echo "current version is `npm view ${pkg_name} --tag SNAPSHOT version`"
current_ver=`npm view ${pkg_name} --tag SNAPSHOT version`
minor=`echo "$current_ver"|sed "s/^.*\.//"`
minor=`expr $minor + 1`
new_ver=`echo "${current_ver}"|sed "s/[0-9]*$/$minor/"`
echo "new_version is ${new_ver}"
  npm version $new_ver
npm publish --tag SNAPSHOT
fi
