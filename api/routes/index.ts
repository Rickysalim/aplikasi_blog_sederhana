import express from 'express';
import post from './post';
import person from './person';
import comment from './comment';
import like from './like';
import wishlist from './wishlist';
import checkToken from '../middleware/auth'

const router: express.Router = express();

router.use(person);
router.use(checkToken.checkToken)
router.use(comment);
router.use(post);
router.use(like);
router.use(wishlist);


export default router;
