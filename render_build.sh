#!/usr/bin/env bash
sent -o errexit
npm install
npm run build
pip install pipenv
pipenv install
pipenv run flask db upgrade
