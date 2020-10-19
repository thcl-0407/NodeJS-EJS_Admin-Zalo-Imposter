const express = require('express')
const admin = require('./controller/admin.js')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('./passport.js')
const app = express();
const Port = 3001;

app.use(bodyParser.urlencoded({extended: true}))
app.use(session(
    {
        name: 'session_login',
        secret: 'cookie_secret',
        resave: false,
        saveUninitialized: false,
    }
))

app.set('views','./views')
app.set('view engine', 'ejs')

app.use(passport.initialize)
app.use(passport.session)

app.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('home')
    }else{
        res.redirect('login')
    }
})

app.route('/login').get((req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('home')
    }else{
        res.render('login')
    }
}).post(passport.passport.authenticate(
    'local',
    {
        successRedirect: '/home',
        failureRedirect: '/login',
    }
))

app.get('/home', (req, res)=>{
    if(req.isAuthenticated()){
        res.render('home')
    }else{
        res.redirect('/login')
    }
})

app.get('/home/usermanage', (req, res)=>{
    if(req.isAuthenticated()){
        res.render('usermanage')
    }else{
        res.redirect('/login')
    }
})

app.post('/logout', (req, res)=>{
    req.logOut()
    res.clearCookie('session_login')
    res.redirect('/')
})

passport.CheckPassport()

app.listen(Port, ()=>{
    console.log("Running on Port " + Port);
})