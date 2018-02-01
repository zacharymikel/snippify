
## Checkpoint 1 Update ##
Accomplished goals:
- Full continuous integration
- Working sign-in api
- Beginning of angular application

## Breakdown of Architecture ##
- Application is deployed on EC2 instance
- Continuous Integration Build Server is on an EC2 instance
- Gitlab repository triggers the build server upon new commits to master branch
- NodeJS API is built into a docker image
- Nginx/angular static files are built into a docker image. Nginx is set up as a reverse proxy, forwarding any incoming request prefixed with '/api/' to the Node application.

## Pending Tasks for this Sprint #
- Set up google authentication for users
- 'Hook up' angular to the node api by creating endpoint calls for user sign-in actions
- Finish the sign-in page views

## Why didn't we finish? ##
- We ran into some problems configuring the continuous integration. Gitlab has a "CI" system that we decided to use that was poorly documented for the setup we were trying to achieve. Now that we have worked through the issues, our development speed is much quicker. It is beneficial to focus on architecture in the beginning of a project so that it is easier to focus on the application concepts later on. The last thing anyone wants is implementation technologies to hinder application development. 
