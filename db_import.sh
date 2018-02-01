#!/bin/bash

echo You should drop your database before importing to avoid key collisions.
echo 'mongo -> use audibitdb -> db.dropDatabase(); -> exit'
sleep 2

echo Importing...
sudo mongoimport --db audibitdb --collection songs --file songs.json
sudo mongoimport --db audibitdb --collection users --file users.json

echo Imported!
