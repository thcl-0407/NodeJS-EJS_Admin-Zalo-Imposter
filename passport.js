const admin = require('./controller/admin.js')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const initialize = passport.initialize()
const session = passport.session()

function CheckPassport(){
    passport.use(new LocalStrategy(
        (username, password, done)=>{
            var user = {
                "TenTaiKhoan": username,
                "MatKhau": password
            }
    
            admin.Login(user, (status, results)=>{
                if(status == true && results != null){
                    return done(null, results)
                }else{
                    return done(null, false)
                }
            })
    }))
    
    passport.serializeUser((user, done)=>{
        done(null, user.recordset[0].TenTaiKhoan)
    })
    
    passport.deserializeUser((name, done)=>{
        admin.GetAdminByName(name, (results)=>{
            if(!results){
                done(null, null)
            }else{
                done(null, results[0])
            }
        })
    })
}

module.exports = {initialize, session, passport, CheckPassport}
