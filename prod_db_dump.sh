#!/bin/bash

# Export the songs out of the prod db
echo Exporting data on remote host...

ssh -i ~/.ssh/aws.pem ubuntu@ec2-34-235-93-216.compute-1.amazonaws.com 'sudo mongoexport --db audibitdb -c songs --out songs.json;sudo mongoexport --db audibitdb -c users --out users.json'

# SCP them onto your machine

echo Copying files onto local machine...

scp -r -i ~/.ssh/aws.pem ubuntu@ec2-34-235-93-216.compute-1.amazonaws.com:/home/ubuntu/users.json ./

scp -r -i ~/.ssh/aws.pem ubuntu@ec2-34-235-93-216.compute-1.amazonaws.com:/home/ubuntu/songs.json ./

echo Done!
