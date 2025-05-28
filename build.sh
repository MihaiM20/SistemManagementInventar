#!/usr/bin/env bash

set -o errexit  # exit on first error

pip install -r requirements.txt

# 1. Colectează static files
python manage.py collectstatic --no-input

# 2. Creează/actualizează schema
python manage.py migrate

