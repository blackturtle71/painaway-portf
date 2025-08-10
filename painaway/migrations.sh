#!/bin/bash

# run migrations

docker-compose exec web python manage.py makemigrations authentication
sleep 2
docker-compose exec web python manage.py makemigrations diary
sleep 2
docker-compose exec web python manage.py makemigrations chat
sleep 2
docker-compose exec web python manage.py migrate
sleep 2
# autopopulate db with BodyPart objects
docker-compose exec web python manage.py loaddata bodyparts.json
sleep 2
