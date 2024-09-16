const { MongoClient } = require("mongodb");
// const url = "mongodb://localhost:27017/";
// const dbName = "PhoneDB";
// const client = new MongoClient(url);

const url = "mongodb+srv://technologyphone:NgzucT9nPN7Yo1ag@mongodb.melnsr4.mongodb.net/?retryWrites=true&w=majority&appName=mongodb"
  

const dbName = "PhoneDB";

const client = new MongoClient(url);

module.exports = { client, dbName };
