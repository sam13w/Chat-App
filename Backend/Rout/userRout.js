import express from 'express';
import isLogin from '../middleWare/isLogin.js';
import {getUserBySearch,getCorrentChatters} from '../routControlers/userhandelerControler.js';

const router =express.Router();
router.get('/search',isLogin,getUserBySearch);
router.get('/currentchatters',isLogin,getCorrentChatters)

export default router;


