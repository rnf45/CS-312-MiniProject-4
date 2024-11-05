import express from 'express';
import { 
    getAllPosts, 
    createPost, 
    deletePost, 
    editPost, 
    signInUser, 
    signUpUser 
} from './controllers.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/create', createPost);
router.post('/delete-post/:DogBlogId', deletePost);
router.get('/edit/:DogBlogId', editPost);
router.post('/edit/:DogBlogId', editPost);
router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', signUpUser);
router.get('/signin', (req, res) => res.render('signin'));
router.post('/signin', signInUser);

export default router;

