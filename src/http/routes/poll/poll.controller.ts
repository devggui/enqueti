import { Request, Response } from "express"
import { randomUUID } from "node:crypto"
import { prisma } from "../../../services/prisma.service"
import z from "zod"

export async function findAll(_: Request, res: Response) {
  const polls = await prisma.poll.findMany({
    include: {
      options: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })  

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
    },
    include: {
      options: {
        select: {          
          id: true,
          title: true
        }
      }
    }
  })  

  return res.status(200).send(polls)
}

export async function createPoll(req: Request, res: Response) {
  const createPollBody = z.object({
    title: z.string(),
    options: z.array(z.string())
  })

  const { title, options } = createPollBody.parse(req.body)

  const poll = await prisma.poll.create({
    data: {
      title,      
      options: {
        createMany: {
          data: options.map(option => {
            return { title: option }
          })
        }
      }
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

export async function voteOnPoll(req: Request, res: Response) {
  const voteOnPollBody = z.object({
    pollOptionId: z.string().uuid()
  })

  const voteOnPollParams = z.object({
    pollId: z.string().uuid()
  })

  const { pollOptionId } = voteOnPollBody.parse(req.body)
  const { pollId } = voteOnPollParams.parse(req.params)    

  let { sessionId } = req.cookies

  if (sessionId) {
    const userPreviousVoteOnPoll = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          sessionId,
          pollId,
        }
      }
    })

    if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
      await prisma.vote.delete({
        where: {
          id: userPreviousVoteOnPoll.id
        }
      })
    } else if (userPreviousVoteOnPoll) {
      return res.status(400).send({ message: 'You already voted on this poll.' })
    }
  }

  if (!sessionId) {
    sessionId = randomUUID()
  
    res.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days,
      signed: true,
      httpOnly: true,
    })
  }  

  await prisma.vote.create({
    data: {
      sessionId,
      pollId,
      pollOptionId
    }
  })

  return res.status(201).send()
}