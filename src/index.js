import {initMongoDB} from './db/mongoose-connection.js';
import dotenv from 'dotenv'
import { app } from './app.js';

dotenv.config({
  path: "./env"
})

initMongoDB()
  .then(() => {
    app.listen(process.env.PORT || 400, () => {
      console.log("Server Started Successfully")
    })
  })
