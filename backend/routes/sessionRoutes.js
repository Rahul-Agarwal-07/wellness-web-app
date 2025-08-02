const express = require('express');
const router = express.Router();
const controller = require('../controllers/sessionController');
const authMiddleware = require('../middlewares/auth');

//Public Get Routes
router.get('/sessions', controller.getPublicSessions);
router.get('/my-sessions', authMiddleware, controller.getMySessions);
router.get('/my-sessions/:id', authMiddleware, controller.getSessionById);

//User POST Methods
router.post('/my-sessions/save-draft', authMiddleware, controller.saveOrUpdateDraft);
router.post('/my-sessions/publish', authMiddleware, controller.publishSession);

//User Delete Methods
router.delete('/my-sessions/:id', authMiddleware, controller.deleteSession);

module.exports = router;