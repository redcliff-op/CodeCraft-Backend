import express, { urlencoded } from 'express';
import cors from 'cors'
import { json } from 'express';

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(express.static('public'))

import userRouter from './routes/user-routes.js';

app.use("/users", userRouter)

export {app}