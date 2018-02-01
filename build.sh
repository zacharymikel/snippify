#!/bin/bash

echo Building api...
cd api/ > /dev/null
npm install > /dev/null
cd ../ > /dev/null
zip -r api.zip api > /dev/null

echo Building client...
cd client/ > /dev/null
npm install > /dev/null
ng build --prod --aot > /dev/null
zip -r ../client.zip dist > /dev/null
cd ../ > /dev/null

scp -i ~/.ssh/aws.pem api.zip ubuntu@ec2-34-235-93-216.compute-1.amazonaws.com:/home/ubuntu/api.zip
scp -i ~/.ssh/aws.pem client.zip ubuntu@ec2-34-235-93-216.compute-1.amazonaws.com:/home/ubuntu/client.zip

echo CURRENT DIRECTORY
pwd

echo FILES
ls

echo Moving files on server...
ssh -i ~/.ssh/aws.pem ubuntu@ec2-34-235-93-216.compute-1.amazonaws.com 'unzip -o api.zip;unzip -o client.zip;pm2 restart server;sudo cp -r dist/* /nginx/www' > /dev/null
echo Finished!
