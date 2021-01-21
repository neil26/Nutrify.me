const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local"); 
const monogoose = require('mongoose');
const flash = require('connect-flash');
const session =require('express-session');
const passport = require('passport');
const path = require('path');


const app=express();
//static middleware
app.use(express.static(path.join(__dirname, 'public')));
 //passport config
 require('./config/passport')(passport);

//DB Config
const db=require('./config/keys').MongoURI;

//connect to Mongo
monogoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
    .then( ()=>console.log("Connected TO Nutrify Me Database on Atlas!"))
    .catch( err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs'); 

//BodyParser
app.use(express.urlencoded( {extended : false}));

//Express session middleware
app.use(session({
    secret: 'secret session',
    resave: true,
    saveUninitialized: true
  }))
//Passport  middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect Flash
app.use(flash()); 

//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');

    next();

})
app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
})

//to render UI according to user logged in or not
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});
//Routes 
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/meals',require('./routes/meals'));

//Body Parser
app.use(bodyParser.urlencoded({extended:true}));

//Port Number
const PORT=process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log(`Server Started on ${PORT}`);
});
