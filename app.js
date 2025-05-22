require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
const connectDB = require('./server/config/db');
const mongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT||5000;

connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'Keyboard cat',
    resave:false,
    saveUninitialized :true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    
}))
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');



app.use('/',require('./server/routes/main.js'));
app.use('/',require('./server/routes/admin.js'));

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`);
    
});