# Snippify
This is a prototype application of a social media site, poorly-named: Snippify. 

Snippify builds off concepts of Instagram and Facebook in that users can post content and follow one another. The unique bit for this social media site is that users are posting songs that they have created, or have obtained copyrights to.

When uploading a new song, the user selects a section of the song (15 sec.) that will be played in other's news feeds. If a "snippet" intrigues you, you're able to click on the song and listen to the full-length feature on the artist's profile. 

This prototype uses a NodeJS server backend to handle user authentication (Passport) and content management. The database is implemented entirely in MongoDB. The UI is built with Angular and Materialize. 

# Building and Running the project
To run this project on your machine, you will need to have NodeJS, NPM, and MongoDB installed. 

## Build the server
`cd api && npm install`

## Build the client
`cd client && npm install`

## Run the application
- Start mongodb on your system 
- Run the following commands:  
`cd api && npm start`  
`cd client && npm start`
