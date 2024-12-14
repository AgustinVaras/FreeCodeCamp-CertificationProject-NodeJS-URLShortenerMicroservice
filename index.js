require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//-----------------------------------------------------------------
//MongoDB setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI,{ 
  useNewUrlParser: true, useUndefinedTopology: true
});

//Schema
const UrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    require: true
  },
  short_url: {
    type: Number,
    require: true
  }
});

//-----------------------------------------------------------------

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
