import express, { urlencoded } from 'express';
import cors from 'cors'
import { json } from 'express';

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({extended:true}))

