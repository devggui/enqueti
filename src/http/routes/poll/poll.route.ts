import { router } from "../../../services/router.service"
import { pollResults } from "./poll.service"
import { 
  createPoll, 
  deletePoll, 
  findAll, 
  findOneById, 
  updatePoll, 
  voteOnPoll
} from "./poll.controller"

router.get('/polls', findAll)
router.get('/polls/:pollId', findOneById)
router.get('/polls/:pollId/results', pollResults)

router.post('/polls', createPoll)
router.post('/polls', createPoll)
router.post('/polls/:pollId/votes', voteOnPoll)

router.put('/polls/:pollId', updatePoll)

router.delete('/polls/:pollId', deletePoll)

export default router