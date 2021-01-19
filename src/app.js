const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');




//get the router page here 
const homeRoute = require('./route/home');
const signupRoute = require('./route/signup');
const loginRoute = require('./route/login');
const profileRoute = require('./route/profile');
const taskRoute = require('./route/tasks');
const groupEditRoute = require('./route/editGroupRouter');
const editTaskRoute = require('./route/editTask.router');
const notFound = require('./route/NotFoundRouter');

//get the app
const app = express();
//create Server 
const server = http.createServer(app);



//get the port 
const port = process.env.PORT || 3000;

//get data from request
app.use(express.urlencoded({
    extended:false
}))

//serve the public folder from server
const pathTopublic = path.join(__dirname, '../public');
app.use(express.static(pathTopublic));

//serve ejs template 
const pathToView = path.join(__dirname, './template/views');
app.set('view engine', 'ejs');
app.set('views', pathToView);


//setup express-session and  flash module
app.use(session({
    //should be exist in .env file
    secret: 'hello world',
    resave:false,
    saveUninitialized:true
}));

app.use(flash());

//setup cookies
app.use(cookieParser());
app.use(
    cors({
      origin: [
        `${process.env.FRONT_URL}`,
        'http://localhost:3000',
        'https://mypage.com',
      ],
      credentials: true
    })
  );


//use the router function
app.use(homeRoute);
app.use(signupRoute);
app.use(loginRoute);
app.use(profileRoute);
app.use(taskRoute);
app.use(groupEditRoute);
app.use(editTaskRoute);
app.use(notFound);


server.listen(port, () => {
    console.log('the app listen to port 3000');
})

