const express = require('express');
const { userRegister, userLogin, userLogOut, checkUserSession } = require('../controllers/userController');
const userRouter = express.Router();
userRouter.post('/user', userRegister);
userRouter.post('/user/login', userLogin);
userRouter.post('/user/logout', userLogOut);
userRouter.get("/user/checkSession",checkUserSession)

module.exports = userRouter;