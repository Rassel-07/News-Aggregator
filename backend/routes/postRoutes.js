const {Router} = require('express')


const {createPost, getPost, editPost, deletePost, getCatPosts,getUsersPosts,getPosts} = require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware')

const router = Router()

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/category/:category', getCatPosts)
router.get('/users/:id', getUsersPosts)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router