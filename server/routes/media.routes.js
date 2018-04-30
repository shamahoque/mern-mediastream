import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import mediaCtrl from '../controllers/media.controller'

const router = express.Router()

router.route('/api/media/new/:userId')
    .post(authCtrl.requireSignin, mediaCtrl.create)

router.param('userId', userCtrl.userByID)

export default router
