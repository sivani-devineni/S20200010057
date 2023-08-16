const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/trainscheduling', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// Define the Train schema
const trainSchema = new mongoose.Schema({
  trainName: String,
  trainNumber: String,
  departureTime: {
    Hours: Number,
    Minutes: Number,
    Seconds: Number
  },
  seatsAvailable: {
    sleeper: Number,
    AC: Number
  },
  price: {
    sleeper: Number,
    AC: Number
  },
  delayedBy: Number
});

const Train = mongoose.model('train', trainSchema);

// Fetch and store train data from John Doe Railway API
app.get('/fetch-trains', async (req, res) => {
  console.log('Fetching train data...');
  try {
    // Fetch data from the John Doe Railway API using the provided bearer token
    const response = await axios.get('http://20.244.56.144/train/trains', {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTIyMDc1NDEsImNvbXBhbnlOYW1lIjoiVHJhaW4gQ2VudHJhbCIsImNsaWVudElEIjoiODQ5MWRjNWEtZTAxYy00MTVhLTg5MmYtYjNkMmU1Y2E0ZDNmIiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6IlMyMDIwMDAxMDA1NyJ9.rPDRUAGuiRs5UvCME6aquZXanPHNEUad4esQKCvSJmE`
      }
    });

    console.log('Fetched train data:', response.data);

    const trainsData = response.data;

    // Store the fetched train data in the MongoDB database
    await Train.insertMany(trainsData);

    res.status(200).json({ message: 'Train data fetched and stored successfully' });
  } catch (error) {
    console.error('Error fetching and storing train data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

