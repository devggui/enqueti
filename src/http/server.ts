import express from "express"
import cors from "cors"
import { createServer } from "node:http"
import { Server } from "socket.io"

import router from "./routes"
import { voting } from "../utils/voting-pub-sub"

const cookieParser = require('cookie-parser')

const app = express()
const server = createServer(app)
export const io = new Server(server)

io.on('connection', () => {
  voting.subscribe('', () => {})
})

app.use(cors({
  allowedHeaders: ['content-type', 'Authorization'],
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(router)

server.listen({
  port: process.env.PORT || 3333
})