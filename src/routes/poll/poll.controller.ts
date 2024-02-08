import { Request, Response } from "express"
import { prisma } from "../../services/prisma.service"
import z from "zod"

export async function findAll(_: Request, res: Response) {
  const polls = await prisma.poll.findMany()

  return res.status(200).send(polls)
}

export async function findOneById(req: Request, res: Response) {
  const findPollParams = z.object({
    pollId: z.string().uuid(),
  })

  const { pollId } = findPollParams.parse(req.params)    

  const polls = await prisma.poll.findUnique({
    where: {
      id: pollId
    }
  })

  return res.status(200).send(polls)
}

export async function createPoll(req: Request, res: Response) {
  const createPollBody = z.object({
    title: z.string()
  })

  const { title } = createPollBody.parse(req.body)

  const poll = await prisma.poll.create({
    data: {
      title,
    }
  })

  return res.status(201).send(poll)
}

export async function updatePoll(req: Request, res: Response) {
  const updatePollBody = z.object({
    title: z.string(),
  })

  const updatePollParams = z.object({
    pollId: z.string().uuid(),
  })
  
  const { title } = updatePollBody.parse(req.body)
  const { pollId } = updatePollParams.parse(req.params)  

  const poll = await prisma.poll.update({
    data: {
      title,    
    },
    where: {
      id: pollId
    }
  })

  return res.status(200).send(poll)
}

export async function deletePoll(req: Request, res: Response) {  
  const deletePollParams = z.object({
    pollId: z.string().uuid(),
  })
    
  const { pollId } = deletePollParams.parse(req.params)  

  await prisma.poll.delete({    
    where: {
      id: pollId
    }
  })

  return res.status(200).send({ message: 'Sucessfully deleted!' })
}