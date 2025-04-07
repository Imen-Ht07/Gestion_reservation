const authorize = require('./middleware/authorize');
const express = require('express');
const { getAllUsers, updateUser, deleteUser } = require('./userController');
const router = express.Router();

router.get('/',authorize('admin') , getAllUsers);
router.put('/:id', authorize('admin') ,updateUser);
router.delete('/:id',authorize('admin') ,deleteUser);

module.exports = router;