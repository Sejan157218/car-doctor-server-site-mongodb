const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();



const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.57jms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('carDoctor');
    const services = database.collection('services');

    // post
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await services.insertOne(service);
      console.log('gergeg', req.body);
      res.json(result)
    })

    // get all
    app.get('/services', async (req, res) => {
      const findservices = services.find({});
      const findservicesAll = await findservices.toArray();
      res.send(findservicesAll)
    })

    // get one 
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const findOne = await services.findOne(filter);
      res.send(findOne);
    })

    // delete service
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const filterservice = { _id: ObjectId(id) };
      const result = await services.deleteOne(filterservice);
      res.json(result);
    })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('this site is runing');
})

app.listen(port, () => {
  console.log('doctor car Running server port', port)
})




/*
one time:
1. heroku account open
2. Heroku software install
Every project
1. git init
2. .gitignore (node_module, .env)
3. push everything to git
4. make sure you have this script:  "start": "node index.js",
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main
----
update:
1. save everything check locally
2. git add, git commit-m", git push
2. git push heroku main
*/