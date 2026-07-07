#!/usr/bin/env bash
set -o errexit
npm install
npm run build
pip install pipenv
pipenv install
pipenv run upgrade
