const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
app.use(express.json());
app.use(cors());
const port = 5000


const uri = "mongodb+srv://bichitra:bichitra1234@cluster0.u5vps.mongodb.net/bichitra-store?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("bichitra-store").collection("books");
  const registrationCollection = client.db("bichitra-store").collection("registration");
  app.get('/books', (req, res) => {
    collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
})
  app.get('/book/:id', (req, res) => {
    const id = req.params.id;
    collection.find({_id: ObjectId(id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
})

app.post('/addRegistration', (req, res) => {
  const registration = req.body;
  registrationCollection.insertOne(registration, (err, result) => {
    console.log(err, result);
    res.send({ count: result.insertedCount });
  })
})

app.get('/registrations', (req, res) => {
  registrationCollection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
})

app.get('/registration/:email', (req, res) => {
  const email = req.params.userEmail;
  registrationCollection.find({email:email})
      .toArray((err, documents) => {
          res.send(documents)
      })
})

app.post('/addBook', (req, res) => {
  const book = req.body;
  collection.insertOne(book, (err, result) => {
      res.send({ count: result.insertedCount });
  })
})

app.delete('/deleteRegistration/:id', (req, res) => {
  const id = req.params.id;
  registrationCollection.deleteOne({_id: ObjectId(id)}, (err) => {
      if(!err) {
          res.send({count: 1})
      }
  })

})

// app.post('/addBook', (req, res) => {
//   const newBook = req.body;
//   collection.insertMany(newBook, (err, result) => {
//     console.log(err, result);
//     res.send({ count: result.insertedCount });
//   })
// })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
});


app.listen(process.env.PORT || port)