const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const mongoPassword = process.env.MONGO_PASSWORD; 
const newMongoPassword = 'MYdulashijc2002'; 
const mongoURI = `mongodb+srv://Dulashi:${newMongoPassword}@cluster0.9judisz.mongodb.net/weather_information`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB Atlas connected');
  })
  .catch(err => {
    console.error('MongoDB Atlas connection error:', err);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});