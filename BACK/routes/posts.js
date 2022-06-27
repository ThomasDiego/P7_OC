const express = require('express');
const router = express.Router();
postsController = require('../controllers/posts');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, postsController.getAll);
router.get('/:id', auth, postsController.getOne);
router.post('/', auth, multer, postsController.create);
router.put('/:id', auth, multer, postsController.editOne);
router.delete('/:id', auth, postsController.deleteOne);
router.post('/:id/like', auth, postsController.like);
router.post('/:id/dislike', auth, postsController.dislike);
router.post('/:id/comment', auth, postsController.comment);
router.get('/:id/comments', auth, postsController.getComments);

module.exports = router;