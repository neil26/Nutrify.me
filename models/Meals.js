const mongoose = require('mongoose');

const MealSchema =new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
    },
    date :{
        type :Date,
        required:true,
        default :Date.now
    },
    mealType :{
        type :String,
        required:true
    },
    mealName : {
        type :String,
        required:true
    },
    mealDesc : {
        type :String,
        required:true
    }
  

});

const Meal = mongoose.model("Meal",MealSchema);

module.exports =  Meal;