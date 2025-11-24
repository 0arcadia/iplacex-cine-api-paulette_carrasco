import { MongoClient } from "mongodb";


const uri = "mongodb+srv://paulettealexandracm_db_user:pau1234@cluster-express.he7tses.mongodb.net/?appName=cluster-express";

const client = new MongoClient(uri);
const dbName = "cine-db";


async function connectToMongo() {
  try {
    await client.connect();
    console.log("✅ Conexión a MongoDB Atlas exitosa");
    return client.db(dbName);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB Atlas:", error.message);
    throw error;
  }
}


function getDb() {
  return client.db(dbName);
}

export { connectToMongo, getDb };
