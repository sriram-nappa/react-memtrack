//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
var bodyParser = require('body-parser');
var memoryInfo = require('./model/PageData');
var pg = require('pg');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

const connectionString = process.env.DATABASE_URL || 'postgres://candidate:giap-quib-fac-wav-mi@aws-us-east-1-portal.8.dblayer.com:10131/memory_tracker'

//now we should configure the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/normalize.css/')); // redirect CSS bootstrap

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

router.route('/pageData')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('SELECT * FROM reports ORDER BY current_page', function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      })
    })
  })

router.route('/pageData/:id')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('SELECT * FROM reports WHERE current_page=$1', [req.params.id.split('*').join('/')], function (err, result) {
        done()
        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      })
    })
  })

router.route('/totalMemory')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('SELECT current_page, SUM(bytes_used) FROM reports GROUP BY current_page', function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      })
    })
  })

router.route('/distinctPages')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('SELECT DISTINCT current_page from reports', function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      })
    })
  })

router.route('/pageCrashTime')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('SELECT current_page, timestamp from reports WHERE did_aww_snap=true ORDER BY current_page', function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      })
    })
  })


router.route('/getDate')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('select current_page, extract(day from to_timestamp(timestamp)) as day, extract(hour from to_timestamp(timestamp)) as hour, did_aww_snap, count(did_aww_snap) from reports where did_aww_snap=true group by current_page,day,hour,did_aww_snap union select current_page,extract(day from to_timestamp(timestamp)) as day, extract(hour from to_timestamp(timestamp)) as hour, did_aww_snap, count(did_aww_snap) from reports where did_aww_snap=false group by current_page,day,hour,did_aww_snap', function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      })
    })
  })

router.route('/getDate/:id')
  .get(function(req, res){
    pg.connect(connectionString, function (err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('select current_page, extract(day from to_timestamp(timestamp)) as day, extract(hour from to_timestamp(timestamp)) as hour, did_aww_snap, count(did_aww_snap) from reports where did_aww_snap=true group by current_page,day,hour,did_aww_snap,current_page union select current_page, extract(day from to_timestamp(timestamp)) as day, extract(hour from to_timestamp(timestamp)) as hour, did_aww_snap, count(did_aww_snap) from reports where did_aww_snap=false group by current_page,day,hour,did_aww_snap'), function(err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        res.send(result.rows);
      }
    })
  })

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
