const express=require('express');
const router=express.Router();
const { ensureAuthenticated, ensureNotAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/',ensureNotAuthenticated,(req,res)=> res.render("welcome"));
//Dashboard Page
router.get('/dashboard',ensureAuthenticated,(req,res)=>
res.render('dashboard',{name:req.user.name}));
module.exports =router;