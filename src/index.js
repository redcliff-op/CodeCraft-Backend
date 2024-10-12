import express, { urlencoded } from 'express';
import cors from 'cors'
import { json } from 'express';
import {initMongoDB} from './db/mongoose-connection.js';
import dotenv from 'dotenv'

dotenv.config({
  path: "./env"
})

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(express.static('public'))

initMongoDB()
  .then(() => {
    app.listen(process.env.PORT || 400, () => {
      console.log("Server Started Successfully")
    })
  })
