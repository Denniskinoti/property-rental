require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path')
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const methodOverride = require('method-override');
const ejs = require('ejs');
const app 	= express();

 app.use(express.static(__dirname + "/public"));
 app.use(express.static(__dirname + '/public/js'));
//user routes
const user = require('./routes/user_auth');
const pages = require('./routes/pages')
const admin = require('./routes/admin');
const property = require('./routes/property');
const category = require('./routes/category');
const reviews = require('./routes/reviews');

app.set('view engine','ejs');

// require('./config/landlord_config')(passport);
require('./config/passport')(passport);

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/pata_space', {useNewUrlParser: true});
app.use(session({
	secret: "secretstringauth",
	resave: true,
	saveUninitialized: true,
	
}))

app.use(methodOverride('_method'));

//body-parser middleware but in express
app.use(express.urlencoded({extended:true}));

//initializing passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//global variables
app.use((req,res,next)=> {
	res.locals.currentUser = req.user;
	res.locals.property_got = req.property
	res.locals.sucess = req.flash('sucess');
	res.locals.error =  req.flash('error');
	res.locals.error_login =  req.flash('error_login');
	next();
});




//user routes
app.use('/users',user);
app.use('/page',pages);
app.use('/admin',admin);
app.use('/property',property);
app.use('/category',category);
app.use('/review',reviews)



const port =  process.env.PORT || 8000

app.listen(port,(err)=> {
	if(err) {
		console.log('server starting error!')
	}
	console.log(`successfully started serve ${port}`)

})
