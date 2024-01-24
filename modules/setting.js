const express = require('express');
const router = express.Router();

require('dotenv').config({path:'config/.env'});
router.use(require('cookie-parser')(process.env.COOKIE_SECRET));
router.use((req,res,next)=>{
    res.setCookie = (key, value, age)=>{
        res.cookie(key, value, {
            path:'/',
            domain:req.domain,
            secure: false,
            httpOnly: false,
            signed: true,
            maxAge: age
        });
    };
    res.removeCookie = (key)=>{
        res.clearCookie(key,  {
            path:'/',
            domain:req.domain,
            secure: false,
            httpOnly: false,
            signed: true
        });
    };
    res.removeAllCookie = ()=>{
        for(let key in req.signedCookies){
            res.clearCookie(key, {
                path:'/',
                domain:req.domain,
                secure: false,
                httpOnly: false,
                signed: true
            });
        }
    };
    req.totalCookies = {...req.cookies, ...req.signedCookies};
    next();
});
router.use(require('cors')({
    origin:`https://localhost:${process.env.ALLOW_PORT}`,
    methods:['get','post', 'put', 'delete', 'patch'],
    allowedHeaders:['Content-Type'],
    exposedHeaders:['Content-Type'],
    maxAge: 1000 * 60 * 30
}));
router.use(express.json());
router.use(express.raw());
router.use(express.text());
router.use(express.urlencoded({extended:true}));
router.use('/resources', express.static('resources', {
    dotfiles:"ignore",
    extensions:[],
    fallthrough:true,
    immutable:false,
    maxAge:18000000,
    index:false,
    redirect:false
}));

module.exports = router;