#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
python manage.py migrate
python manage.py collectstatic --noinput
