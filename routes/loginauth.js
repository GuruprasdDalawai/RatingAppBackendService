const express =require('express');
const router=express.Router();
const loginService=require('../services/middlewares/loginService')

router.post('/login',async(req, res)=>{
    const { employeeId, password} = req.body;
    try{
        const {token, user}= await loginService(employeeId, password);
        res.status(200).json({
            messasge:'Login successful',
            token,
            user
        })
    }catch(err){
        res.status(err.status||500).json({error:err.messasge})
    }
})

module.exports= router;