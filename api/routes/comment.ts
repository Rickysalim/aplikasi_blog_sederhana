import express from 'express';
import comment from '../controllers/comment';
const router: express.Router = express();

router.get('/comment/:id', comment.findOneComment);
router.post('/comment',comment.createComment);
router.delete('/comment/:id', comment.deleteComment);
router.delete('/comment/:id/:parent_id', comment.deleteCommentParent);
router.put('/comment/:id',comment.updateComment);


export default router;