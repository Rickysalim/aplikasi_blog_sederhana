import express from 'express';
import post from '../controllers/post';

const router: express.Router = express();

router.get('/post', post.findAllPost);
router.get('/post/:title', post.findOnePost);
router.post('/post', post.createPost);
router.put('/post/:id', post.updatePost);
router.delete('/post/:id', post.deletePost);


export default router;
