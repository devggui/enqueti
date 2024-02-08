import { router } from "../../services/router.service"

import { 
  createPoll, 
  deletePoll, 
  findAll, 
  findOneById, 
  updatePoll 
} from "./poll.controller"

router.get('/polls', findAll)
router.get('/polls/:pollId', findOneById)
router.post('/polls', createPoll)
router.put('/polls/:pollId', updatePoll)
router.delete('/polls/:pollId', deletePoll)

export default router