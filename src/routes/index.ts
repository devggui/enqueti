import { router } from "../services/router.service"

import pollRoutes from "./poll/poll.route"

router.use(pollRoutes)

export default router