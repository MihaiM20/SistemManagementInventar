#!/usr/bin/env bash

set -o errexit  # exit on first error

pip install -r requirements.txt

# 1. Colectează static files
python manage.py collectstatic --no-input

# 2. Creează/actualizează schema
python manage.py migrate

# 3. Golește toate datele (tabelele rămân, dar nu mai conțin rânduri)
python manage.py flush --no-input

# 4. Încarcă fixture-ul cu datele tale
python manage.py loaddata all_data.json

# 5. Creează superuser-ul "admin"/"admin123" dacă lipsește
python manage.py shell -c "\
from django.contrib.auth import get_user_model; \
U=get_user_model(); \
U.objects.filter(username='admin').exists() or \
U.objects.create_superuser('admin','admin@admin.com','admin123')"