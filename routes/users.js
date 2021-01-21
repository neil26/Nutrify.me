const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt= require('jsonwebtoken');
const { ensureAuthenticatedLogin,ensureNotAuthenticated } = require('../config/auth');


// User Model
const User = require('../models/Users');
const passport = require('passport');
//Login Page
router.get('/login',ensureNotAuthenticated,(req,res)=>{
    res.render("login");
});

//Register page
router.get('/register',ensureNotAuthenticated,(req,res)=>{
    res.render("register");
});
//Register Handler
router.post('/register',ensureNotAuthenticated,(req,res)=>{
   const {name,email,password,confPassword} =req.body;
   let errors=[];
   //check required Fields
   if(!name ||!email || !password || !confPassword){
       errors.push({msg : "Please Fill All Fields!"});
   }
   //check password match
   if(password !== confPassword){
       errors.push({msg : "Password Do Not Match"});
   }
   //check pass length
   if(password.length < 6){
       errors.push({msg : "Password Must be Atleast 6 charaters Long"});
   }
   if(errors.length > 0){
       res.render('register',{
           errors,
           name,
           email,
           password,
           confPassword
       });
   }
   else{
       // validation passes 
       User.findOne( {email : email } )
       .then(user =>{
            if(user){
                // User Exist 
                errors.push({msg : 'Sorry... The E-Mail is Already Registered!'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    confPassword
                });
            }
            else{
                const newUser  = new User ({
                    name,
                    email,
                    password  
                });
                //Hash Password 
                bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,
                    (err,hash)=>{
                       if(err) throw err;
                       //set Password to Hashed.
                       newUser.password = hash; 
                       //save User to Database
                       newUser.save()
                       .then(user => {
                        req.flash('success_msg','You are now registered and can log in');   
                        res.redirect('/users/login')
                        }) 
                       .catch(err => console.log(err));
                    }));
            }
       });
       
    }
});


//Login Handler
router.post('/login',ensureNotAuthenticated,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next)
})

router.get('/logout',(req,res) =>{
   req.logout();
  
   req.flash('success_msg','You are successfuly Logged out');
   res.redirect('/users/login');  
});
module.exports =router;
