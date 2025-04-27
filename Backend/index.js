import express from "express"
import dotenv from 'dotenv'
import dbConnect from "./Connect_DB.js";
import authRouter from  './rout/authUser.js'
import messageRouter from './rout/messageRout.js'
import userRouter from './rout/userRout.js'
import cookieParser from "cookie-parser";

import {app , server} from './Socket/socket.js'


dotenv.config();


app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)


const PORT = process.env.PORT || 4500

server.listen(PORT,()=>{
    dbConnect();
    console.log(`Working at ${PORT}`);
})