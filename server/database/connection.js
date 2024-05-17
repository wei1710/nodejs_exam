import { MongoClient } from "mongodb";

// Connection URL
const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);

// Database Name
const dbName = "movie_portal";

await client.connect();

const db = client.db(dbName);

export default {
  users: db.collection("users"),
  movies: db.collection("movies"),
};