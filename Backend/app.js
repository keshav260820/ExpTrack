import express from 'express'
import databaseConnection from "./database/dbConnection.js"
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import router from './routes/userAuthRoute.js'
import rideRouter from './routes/rideRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: './config/config.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const staticPath = path.join(__dirname, 'public')
const app = express()

app.use(express.static(staticPath))
app.use(express.static(path.join(__dirname, '../Frontend')))

app.set('view engine', 'jsx')
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v4/user', router)
app.use('/api/v4/rides', rideRouter)

app.get('/', (req, res) => {
    const dashboardPath = path.join(__dirname, '../Frontend/login.html');
    res.sendFile(dashboardPath);
});

databaseConnection()

export default app;