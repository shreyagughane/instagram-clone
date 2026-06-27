const { MongoClient } = require("mongodb");

const uri = "PUT_YOUR_MONGO_URI_HERE";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully!");
  } catch (err) {
    console.log(err);
  }
}
run();