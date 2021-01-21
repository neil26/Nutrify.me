const express=require('express');
const router=express.Router();
const { ensureAuthenticated } = require('../config/auth');

// User Model
const User = require('../models/Users');
const Meal=require('../models/Meals');

// New Meal Get Page
router.get('/AddNewMeal',ensureAuthenticated,(req,res)=>
res.send(`Hello ${req.user.name}`));

// New Meal  post Page
router.post('/AddNewMeal',ensureAuthenticated,(req,res)=>{
    const {date,mealType,mealName,mealDesc} =req.body;
    //to get current user id;
    userid = req.user.id;
    let errors=[];
    console.log(userid,date,mealType,mealName,mealDesc);
     //check required Fields
   if(!date||!mealType|| !mealName || !mealDesc){
    errors.push({msg : "Please Fill All Fields!"});
   }
    if(errors.length > 0){
        res.render('dashboard',{
            errors,
            date,
            mealType,
            mealName,
            mealDesc
        });
    }
    else {
        //vadlidation passes
        const newMeal= new  Meal({user:userid,date,mealType,mealName,mealDesc});
        Meal.create(newMeal)
        .then(()=> {
            console.log("data Inserted");
            res.redirect("/dashboard");
        })
        .catch((err)=>console.log(err))
    }

});


module.exports =router;