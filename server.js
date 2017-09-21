'use strict';

/*
- create constant that will access the express functionality -- DONE
- declare a port for my server to listen on -- DONE
- be able to call the actual functionality of express as an "app" -- DONE
- use other files in the public directory that aren't HTML, like .js, .json, .css, images, etc. -- DONE
- use app.get() to wait for a get request to a specific route, and declare the functionality that is executed when that request is received; the home page to start -- DONE
- use app.listen() to turn our server on and wait for action on the declared port -- DONE
- import the functionality that allows us to talk to a postgres server -- DONE
- import the functionality that allows us to parse a request body -- DONE
- need to have the location of our postgres database so that it can be pointed to -- DONE
- set up an object instance to talk to our postgres database -- DONE
- connect to the database -- DONE
*/
const EXPRESS = require('express');
const PG = require('pg');
const PARSER = require('body-parser');
const PORT = process.env.PORT || 3000;
const APP = EXPRESS();
APP.use(EXPRESS.static('public'));

APP.get('/', function(request, response){
  response.sendFile('index.html', {root: './public'});
});

APP.listen(PORT, function(){
  console.log(`Listening on port ${ PORT }`);
});

const DATABASE_LOCATION = process.env.DATABASE_URL || 'postgres://localhost:5432/groceries';
const CLIENT = new PG.Client(DATABASE_LOCATION);
CLIENT.connect();
