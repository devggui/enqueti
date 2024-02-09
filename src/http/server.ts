import express from "express"
import cors from "cors"
import router from "./routes"
import { createServer } from "node:http"
import { WebSocketServer } from "ws"

const cookieParser = require('cookie-parser')

const app = express()
const server = createServer(app)
export const wss = new WebSocketServer({ server })

app.use(cookieParser())

app.use(cors({
  allowedHeaders: ['content-type', 'Authorization'],
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)

server.listen({
  port: process.env.PORT || 3333
})