const router = require('express').Router();
const { getUsers, getProfile, createUser, updateUser,  updateAvatar } = require('../controllers/users.js')


router.get('/users', getUsers);
router.get('/users/:_id', getProfile);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;