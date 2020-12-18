const sql = require('mssql')

const pool = new sql.ConnectionPool({
    user: 'admin',
    password: 'sapassword',
    server: 'importes.cdi9bnuvfhs5.ap-southeast-1.rds.amazonaws.com',
    database: 'IMPOSTER',
});

const poolConnection = pool.connect();

module.exports = {sql, pool, poolConnection}

