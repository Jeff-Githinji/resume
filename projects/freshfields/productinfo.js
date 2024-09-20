const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'projectusers';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  console.log('Connected to MongoDB');
  
  const db = client.db(dbName);

  // Insert a document for a farmer selling tomatoes
  const productinfoCollection = db.collection('productinfo');
  console.log('Inserting document...');

  productinfoCollection.insertOne({
    category: 'tomatoes',
    name: 'Chrisphus',
    price: 200,
    description: 'Fresh organic tomatoes from our farm',
    image: 'images/tomatoes.jfif'
  }, (err, result) => {
    if (err) {
      console.error('Error inserting document:', err);
    } else {
      console.log('Document inserted successfully:', result.insertedId);

      // Fetch the inserted document and log it
      productinfoCollection.findOne({ _id: result.insertedId }, (err, doc) => {
        if (err) {
          console.error('Error fetching inserted document:', err);
        } else {
          console.log('Inserted Document:', doc);
        }
        client.close();
      });
    }
  });
});

// Server
const port = 6000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});








  