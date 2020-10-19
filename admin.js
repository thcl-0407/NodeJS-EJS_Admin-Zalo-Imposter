const express = require('express')
const admin = require('./controller/admin.js')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./passport.js')
const app = express();
const Port = 3001;

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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

//Main Route
app.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('home')
    }else{
        res.redirect('login')
    }
})

//Đăng Nhập
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


//Render Trang Chủ
app.get('/home', (req, res)=>{
    if(req.isAuthenticated()){
        res.render('home')
    }else{
        res.redirect('/login')
    }
})

//Render Trang Quản Lý Người Dùng
app.get('/home/usermanage', (req, res)=>{
    if(req.isAuthenticated()){
        admin.GetNguoiDung(
            (results)=>{
                if(!results){
                    res.render('usermanage',{
                        users: null
                    }) 
                }else{
                    res.render('usermanage', {
                        users: results
                    })
                }    
            }
        )
    }else{
        res.redirect('/login')
    }
})

//Thêm Người Dùng
app.post('/home/usermanage/adduser', (req, res)=>{
    if(req.isAuthenticated()){
        var user = {
            HoTen: req.body.fullname,
            SoDienThoai: req.body.phone,
            MatKhau: req.body.password
        }

        if(user != null){
            admin.CreateUser(user, (status)=>{
                if(status){
                    res.redirect('/home/usermanage')
                }
            })
        }
    }
})

//Cập Nhật Trạng Thái
app.patch('/home/usermanage/changestatus', (req, res)=>{
    if(req.isAuthenticated()){
        var user = {
            MaNguoiDung: req.body.MaNguoiDung,
            Status: req.body.Status
        }

        if(user != null){
            admin.UpdateStatusUser(user, (status)=>{
                if(status){
                    res.send(true)
                }else{
                    res.send(false)
                }
            })
        }
    }
})

//Đăng Xuất
app.post('/logout', (req, res)=>{
    req.logOut()
    res.clearCookie('session_login')
    res.redirect('/')
})

passport.CheckPassport()

app.listen(Port, ()=>{
    console.log("Running on Port " + Port);
})