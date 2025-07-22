#!/bin/bash

# run migrations
python manage.py migrate

# autopopulate db with BodyPart objects
python manage.py loaddata bodyparts.json

# start the server
exec python manage.py runserver 0.0.0.0:8000