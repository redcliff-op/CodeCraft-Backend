import mongoose from "mongoose";
import { DB_NAME } from "../utils/Constants.js";

const initMongoDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`Mongoose Connection Success! DB-Host : ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("Mongoose Connection Failed : ", error)
    process.exit(1)
  }
}

export {initMongoDB}