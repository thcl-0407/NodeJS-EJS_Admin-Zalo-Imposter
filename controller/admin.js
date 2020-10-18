const bcrypt = require('bcrypt')
const mssql = require('../dbConnect.js')
const poolConnection = mssql.poolConnection
const pool = mssql.pool

async function CreateUser(user, callback) {
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('HoTen', mssql.sql.NVarChar, user.HoTen)
        .input('TenTaiKhoan', mssql.sql.NVarChar, user.TenTaiKhoan)
        .input('MatKhau', mssql.sql.NVarChar, bcrypt.hashSync(user.MatKhau, bcrypt.genSaltSync(10)))
        .query('INSERT INTO Admin(HoTen, TenTaiKhoan, MatKhau) VALUES (@HoTen, @TenTaiKhoan, @MatKhau)')
        if(result.rowsAffected[0] == 1){
            callback(true)
        }else{
            callback(false)
        }
    } catch (err) {
        console.error('DB error', err);
        callback(false)
    }
}

async function Login(user, callback) {
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('TenTaiKhoan', mssql.sql.NVarChar, user.TenTaiKhoan)
        .input('MatKhau', mssql.sql.NVarChar, user.MatKhau)
        .query('SELECT * FROM Admin WHERE TenTaiKhoan = @TenTaiKhoan OR MatKhau = @MatKhau')
        if(result.recordset.length == 1){
            const isMatch = bcrypt.compareSync(user.MatKhau, result.recordset[0].MatKhau);
            if(isMatch){
                callback(true, result)
            }else{
                callback(false, null)
            }
        }else{
            callback(false, null)
        }
    } catch (err) {
        console.error('DB error', err);
        callback(false, null)
    }
}

async function GetUserByName(name, callback) {
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('TenTaiKhoan', mssql.sql.NVarChar, name)
        .query('SELECT * FROM Admin WHERE TenTaiKhoan = @TenTaiKhoan')
        callback(result.recordsets)
    } catch (err) {
        console.error('DB error', err);
        callback(false)
    }
}


module.exports = {CreateUser, Login, GetUserByName}
