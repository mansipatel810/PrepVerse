const router = require('express').Router();
const userController = require('../../controllers/user.controller/user.controller.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');

router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.get('/logout', userController.userLogout);
router.get('/current-user', authMiddleware, userController.currentUser);

module.exports = router;