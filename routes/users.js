const userRouter = require('express').Router();
const {
  getUsers, getUser, createUser, updateAvatar, updateUser, getMyInfo
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getMyInfo);
userRouter.get('/users/:_id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
