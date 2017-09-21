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
APP.use(PARSER.json()); // look specifically for json in the request body, and add that as a property called "json" to the request object.
APP.use(PARSER.urlencoded({ extended: true })); // parse the request body if there's data attached into whatever valid javascript object it would match; it will add that request body to the property "body" of the request object

APP.get('/', function(request, response){
  response.sendFile('index.html', {root: './public'});
});

const DATABASE_LOCATION = process.env.DATABASE_URL || 'postgres://localhost:5432/groceries';
const CLIENT = new PG.Client(DATABASE_LOCATION);
CLIENT.connect();

/*
Desired Functionality
- add new groceries to store -- DONE
- list all groceries in the store -- DONE
- list all groceries in a category
- show the detail for one grocery -- DONE
- update the groceries in the store
- remove groceries from my store
*/

/*
Grocery Object:
- id integer primary key serial
- name varchar(100)
- category varchar(100)
- price double precision
- quantity integer
*/

/* Use the postgres client to send a query that creates our groceries table */
CLIENT.query(`CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  quantity INTEGER NOT NULL
);`);

/* add new groceries to the store */
APP.post('/api/inventory', function(request, response){
  CLIENT.query(`INSERT INTO inventory
    (name, category, price, quantity)
    VALUES
    ($1, $2, $3, $4);`, [
      request.body.name,
      request.body.category,
      request.body.price,
      request.body.quantity
    ])
    .then(function(){
      response.send('New item added to inventory.');
    })
    .catch(function(err){
      console.error(err);
      response.status(400).send('Something was wrong with the request sent.');
    });
});

// REpresentational State Transfer == REST
/* Get all of my inventory */
APP.get('/api/inventory', function(request, response){
  CLIENT.query(`SELECT * FROM inventory;`)
    .then(function(result){
      response.send(result.rows);
    })
    .catch(function(err){
      console.error(err);
      response.status(500).send('Cannot access the data in the inventory table.');
    });
});

/* Show the detail for one item */
APP.get('/api/inventory/:name([a-zA-Z]+)', function(request, response){
  CLIENT.query(`SELECT * FROM inventory WHERE name=$1;`, [request.params.name])
    .then(function(result){
      response.send(result.rows);
    })
    .catch(function(err){
      console.error(err);
      response.status(500).send('Cannot access the data in the inventory table.');
    });
});

APP.get('/api/inventory/:id([0-9]+)', function(request, response){
  CLIENT.query(`SELECT * FROM inventory WHERE id=$1;`, [request.params.id])
    .then(function(result){
      response.send(result.rows);
    })
    .catch(function(err){
      console.error(err);
      response.status(500).send('Cannot access the data in the inventory table.');
    });
});

/* update the groceries in the store */
APP.put('/api/inventory/:id', function(request, response){
  console.log(request.body);
  CLIENT.query(`UPDATE inventory
    SET name=$2, category=$3, quantity=$4, price=$5
    WHERE id=$1;`, [
      request.params.id,
      request.body.name,
      request.body.category,
      request.body.quantity,
      request.body.price
    ])
    .then(function(){
      response.send('Your item has been updated!');
    })
    .catch(function(err){
      console.error(err);
    });
});

APP.listen(PORT, function(){
  console.log(`Listening on port ${ PORT }`);
});
