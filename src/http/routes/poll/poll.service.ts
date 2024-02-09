import { Request, Response } from "express"
import { wss } from "../../server"

export async function pollResults(req: Request, res: Response) {        
  wss.on('connection', (ws) => {      
    ws.on('message', (message: string) => {
      ws.send(message)
    })
  })
}