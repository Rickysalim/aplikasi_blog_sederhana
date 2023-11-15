import express from 'express';
import person from '../controllers/person';

const router: express.Router = express();

router.post('/auth', person.findPerson);
router.post('/register', person.createPerson);
router.post('/auth/google', person.createPersonWithGoogle)
router.get('/profile', person.profilePerson);
router.put('/profile/me', person.updatePerson);

export default router;