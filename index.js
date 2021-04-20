const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
 ObjectID = require('mongodb').ObjectID

require('dotenv').config()

const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.send('Hello i am working!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwabo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection sucessfully done',err);
  const productCollection = client.db("carSurgeous").collection("surgeous");
  const reviewCollection = client.db("carSurgeous").collection("reviews");
  const adminCollection = client.db("carSurgeous").collection("admins");
 
 app.get('/events',(req,res)=>{
   productCollection.find()
   .toArray((err,items)=>{
    //   
    res.send(items)
   })
 })

 app.get('/events/:id',(req,res)=>{
    const id = ObjectID(req.params.id);
    productCollection.find({_id:id})
    .toArray((err,items)=>{
        res.send(items)
   
  
    })
  })


 app.get('/reviews',(req,res)=>{
    reviewCollection.find()
    .toArray((err,items)=>{
     //   
     res.send(items)
    })
  })

  app.get('/admins',(req,res)=>{
    adminCollection.find()
    .toArray((err,items)=>{
     //   
     res.send(items)
    })
  })

  app.post('/addElement',(req,res)=>{
    const newElement = req.body;
    console.log('add new product: ',newElement);
    productCollection.insertOne(newElement)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send( result.insertedCount > 0)
    });

  });


  app.post('/addReview',(req,res)=>{
    const newReview = req.body;
    console.log('add new review: ', newReview);
    reviewCollection.insertOne(newReview)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send( result.insertedCount > 0)
    });

  });


  app.post('/addAdmin',(req,res)=>{
    const newAdmin = req.body;
    console.log('add new admin: ', newAdmin);
    adminCollection.insertOne(newAdmin)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send( result.insertedCount > 0)
    });
  });
  app.get('/isAdmin', (req, res) => {
    const email = req.query.email;
    console.log(email);
    adminCollection.find({ email: email })
        .toArray((err, doctors) => {
            res.send(doctors.length > 0);
        })
})





});
app.listen(process.env.PORT || port)