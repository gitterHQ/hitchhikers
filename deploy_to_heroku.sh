#!/bin/bash
git checkout -b deploy-`date +"%F-%H_%M_%S"`
npm install
npm run build
rm -rf .gitignore
git add -A
git commit -m 'deploy'
git push heroku master -f
git checkout master
