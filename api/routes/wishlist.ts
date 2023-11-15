import express from 'express';
import wishlist from '../controllers/wishlist';

const router: express.Router = express();

router.get('/wishlist/me', wishlist.getWishList);
router.post('/wishlist', wishlist.createWishList);
router.delete('/wishlist/:id', wishlist.deleteWishList);

export default router;