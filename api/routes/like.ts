import express from 'express';
import like from '../controllers/like';
const router: express.Router = express();

router.post('/like', like.createLike);
router.get('/check/like/:post_id', like.checkPersonLike);
router.get('/count/like/:post_id', like.countLike);

router.get("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: 'wrong url'
    })
})

export default router;