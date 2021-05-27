const express = require("express");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylija.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {

  console.log("Error is:", err)
  console.log("Database connected successfully")


  const bookCollection = client.db("bookShelf").collection("discoverAll");

  app.post("/postAllBook", (req, res) => {
    bookCollection.insertMany(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  })

  app.get('/allBook', (req, res) => {
    bookCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});