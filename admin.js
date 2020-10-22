const express = require('express')
const admin = require('./controller/admin.js')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./passport.js')
const app = express();
const Port = 3001;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session(
    {
        name: 'session_login',
        secret: 'cookie_secret',
        resave: false,
        saveUninitialized: false,
    }
))

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(passport.initialize)
app.use(passport.session)

//Main Route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('home')
    } else {
        res.redirect('login')
    }
})

//Đăng Nhập
app.route('/login').get((req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('home')
    } else {
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
app.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('home')
    } else {
        res.redirect('/login')
    }
})

//Render Trang Quản Lý Người Dùng
app.get('/home/usermanage', (req, res) => {
    if (req.isAuthenticated()) {
        admin.GetNguoiDung(
            (results) => {
                if (!results) {
                    res.render('usermanage', {
                        users: null
                    })
                } else {
                    results.forEach(result => {
                        if (result.NgaySinh != null) {
                            let date = JSON.stringify(result.NgaySinh)
                            date = date.slice(1, 11).split('-')
                            let ngay = date[2]
                            let thang = date[1]
                            let nam = date[0]

                            result.NgaySinh = ngay + '-' + thang + '-' + nam
                        }

                        if (result.GioiTinh != null) {
                            if (result.GioiTinh) {
                                result.GioiTinh = "Nam"
                            } else {
                                result.GioiTinh = "Nữ"
                            }
                        }
                    });

                    res.render('usermanage', {
                        users: results
                    })
                }
            }
        )
    } else {
        res.redirect('/login')
    }
})


//Get Danh Sách Người Dùng Bằng Số Điện Thoại
app.post('/home/usermanage/findphone', (req, res) => {
    if (req.isAuthenticated()) {
        admin.GetNguoiDungbySDT(req.body.SoDienThoai,
            (results) => {
                if (!results) {
                    res.send(false)
                } else {
                    results.forEach(result => {
                        if (result.NgaySinh != null) {
                            let date = JSON.stringify(result.NgaySinh)
                            date = date.slice(1, 11).split('-')
                            let ngay = date[2]
                            let thang = date[1]
                            let nam = date[0]

                            result.NgaySinh = ngay + '-' + thang + '-' + nam
                        }

                        if (result.GioiTinh != null) {
                            if (result.GioiTinh) {
                                result.GioiTinh = "Nam"
                            } else {
                                result.GioiTinh = "Nữ"
                            }
                        }
                    });

                    res.send(results)
                }
            }
        )
    } else {
        res.redirect('/login')
    }
})


//Thêm Người Dùng
app.post('/home/usermanage/adduser', (req, res) => {
    if (req.isAuthenticated()) {
        var user = {
            HoTen: req.body.HoTen,
            SoDienThoai: req.body.SoDienThoai,
            MatKhau: req.body.MatKhau
        }

        if (user != null) {
            admin.GetNguoiDungbySDT(user.SoDienThoai, (result) => {
                if (!result) {
                    res.send(false)
                }

                if (result != null) {
                    if (result.length == 0) {
                        admin.CreateUser(user, (status) => {
                            if (status) {
                                res.send(true)
                            } else {
                                res.send(false)
                            }
                        })
                    } else {
                        res.send(false)
                    }
                }
            })
        }
    }
})

//Cập Nhật Trạng Thái
app.patch('/home/usermanage/changestatus', (req, res) => {
    if (req.isAuthenticated()) {
        var user = {
            MaNguoiDung: req.body.MaNguoiDung,
            Status: req.body.Status
        }

        if (user != null) {
            admin.UpdateStatusUser(user, (status) => {
                if (status) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        }
    }
})

//Xoá Người Dùng
app.post('/home/usermanage/deleteuser', (req, res) => {
    if (req.isAuthenticated()) {
        var user = {
            MaNguoiDung: req.body.MaNguoiDung
        }

        if (user != null) {
            admin.DeleteUser(user, (status) => {
                if (status) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        }
    }
})

//Đổi Mật Khẩu Admin
app.get('/home/adminchangepass', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('adminchangepass')
    } else {
        res.redirect('/login')
    }
})
app.post('/home/adminchangepass', (req, res) => {
    if (req.isAuthenticated()) {
        let user = {
            TenTaiKhoan: req.session.passport.user,
            MatKhau: req.body.MatKhau
        }

        admin.UpdatePassword(user, (result) => {
            if (result) {
                req.logOut()
                res.clearCookie('session_login')
                res.redirect('/')
            }else{
                res.send("Error")
            }
        })
    } else {
        res.redirect('/login')
    }
})

//Đăng Xuất
app.post('/logout', (req, res) => {
    req.logOut()
    res.clearCookie('session_login')
    res.redirect('/')
})

passport.CheckPassport()

app.listen(Port, () => {
    console.log("Running on Port " + Port);
})