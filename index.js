require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//-----------------------------------------------------------------
//MongoDB setup
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(process.env.MONGO_URI,{ 
  useNewUrlParser: true, useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected succesfully'))
  .catch((err) => console.error('Error connecting to DB: ' + err));

//Schema
const shortUrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    require: true
  },
  short_url: Number
});

//Add autoincrement for field short_url
shortUrlSchema.plugin(AutoIncrement, { inc_field: 'short_url' });

//Model
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

//-----------------------------------------------------------------

// Basic Configuration
const port = process.env.PORT || 3000;

//-----------------------------------------------------------------
//Functions
const dns = require('dns');
const url = require('url');
const validateURL = async (submitedURL) => {
  try {
    const { hostname } = new URL(submitedURL);

    await dns.promises.lookup(hostname);
    return true
  } catch (err) {
    console.error("Unexpected error: " + err);
    return false;
  }
};

//-----------------------------------------------------------------
app.use(cors());
//Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const submitedURL = req.body.url;

  if( await validateURL(submitedURL) ) {
    try {
      const newShortUrl = new ShortUrl({
        original_url: submitedURL
      });
      
      await newShortUrl.save();
      
      res.json({
        original_url: submitedURL,
        short_url: newShortUrl.short_url
      })
    } catch (err) {
      console.error(err);
      res.json({ 
        error: "server error: " + err
      });
    }
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const submitedShortURL = req.params.shorturl;
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
