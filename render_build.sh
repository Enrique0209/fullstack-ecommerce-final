#!/usr/bin/env bash
set -o errexit
pip install pipenv
npm install
npm run build
pipenv install 
pipenv run upgrade
