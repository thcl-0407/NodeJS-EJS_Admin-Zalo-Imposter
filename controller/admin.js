const bcrypt = require('bcrypt')
const mssql = require('../dbConnect.js')
const poolConnection = mssql.poolConnection
const pool = mssql.pool

async function CreateAdministrator(user, callback) {
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

async function GetAdminByName(name, callback) {
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('TenTaiKhoan', mssql.sql.NVarChar, name)
        .query('SELECT * FROM Admin WHERE TenTaiKhoan = @TenTaiKhoan')
        callback(result.recordset)
    } catch (err) {
        console.error('DB error', err);
        callback(false)
    }
}

async function GetNguoiDung(callback) {
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .query('SELECT * FROM NguoiDung')
        callback(result.recordset)
    } catch (err) {
        console.error('DB error', err);
        callback(false)
    }
}

async function GetNguoiDungbySDT(sdt ,callback) {
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('SoDienThoai', mssql.sql.NVarChar, sdt)
        .query('SELECT * FROM NguoiDung WHERE SoDienThoai = @SoDienThoai')
        callback(result.recordset)
    } catch (err) {
        console.error('DB error', err);
        callback(false)
    }
}

async function CreateUser(user ,callback){
    await poolConnection;
            try {
                const request = pool.request();
                const result = await request
                .input('HoTen', mssql.sql.NVarChar, user.HoTen)
                .input('SoDienThoai', mssql.sql.NVarChar, user.SoDienThoai)
                .input('Password', mssql.sql.NVarChar, bcrypt.hashSync(user.MatKhau, bcrypt.genSaltSync(10)))
                .query('INSERT INTO NguoiDung(HoTen, SoDienThoai, Password) VALUES(@HoTen, @SoDienThoai, @Password)')
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

async function UpdateStatusUser(user ,callback){
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('Status', mssql.sql.Bit, user.Status)
        .input('MaNguoiDung', mssql.sql.NVarChar, user.MaNguoiDung)
        .query('UPDATE dbo.NguoiDung SET Status = @Status WHERE MaNguoiDung = @MaNguoiDung')
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

async function DeleteUser(user ,callback){
    await poolConnection;
    try {
        const request = pool.request();
        const result = await request
        .input('MaNguoiDung', mssql.sql.NVarChar, user.MaNguoiDung)
        .query('DELETE FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung')
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

module.exports = {CreateAdministrator, CreateUser, Login, GetAdminByName, GetNguoiDung, UpdateStatusUser, DeleteUser, GetNguoiDungbySDT}
