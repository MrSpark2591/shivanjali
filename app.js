const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
var db = require(path.join(__dirname, './db/db.js'));

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

// Connect to Mongo on start
db.connect('mongodb://localhost:27017/shivanjali', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
});

app.use(bodyparser.json());

app.get('/', function(req, res) {
  var products = db.get().collection('products').find().toArray(function(error, docs) {
    res.status(200).send(docs);
  });
});

app.post('/add/product', function(req, res) {
  db.get().collection('products').insert(req.body);
  res.status(200).send();
});

app.put('/update/product', function(req, res) {
  console.log(req.body._id);
  db.get().collection('products').update({ '_id': db.ObjectID(req.body._id) }, {
    '$set': {
      'productDetails': req.body.productDetails
    }
  });
  res.status(200).send();
})