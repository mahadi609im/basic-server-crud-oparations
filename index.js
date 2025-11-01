const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://smart-deals-db:DARLgl3FPa4dXrkl@cluster0.4k43auc.mongodb.net/?appName=Cluster0';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const playerDB = client.db('playerDB');
    const playerCollections = playerDB.collection('players');

    // get all players
    app.get('/players', async (req, res) => {
      const cursor = playerCollections.find({});
      const allValues = await cursor.toArray();
      res.send(allValues);
    });

    // get player details
    app.get('/players/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const playersDetails = await playerCollections.findOne(query);
      res.send(playersDetails);
    });

    // post new player
    app.post('/players', async (req, res) => {
      const players = req.body;
      const result = await playerCollections.insertOne(players);
      res.send(result);
    });

    app.delete('/players/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await playerCollections.deleteOne(query);
      res.send(result);
    });

    // update player
    app.patch('/players/:id', async (req, res) => {
      const id = req.params.id;
      const players = req.body;

      const query = { _id: new ObjectId(id) };
      const update = { $set: { Name: players.Name, Goal: players.Goal } };
      const options = {};
      const result = await playerCollections.updateOne(query, update, options);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Bismillah');
});

app.listen(port, () => {
  console.log('Server running...');
});
