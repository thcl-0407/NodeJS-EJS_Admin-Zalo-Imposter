const sql = require('mssql')

const pool = new sql.ConnectionPool({
    user: 'admin',
    password: 'sapassword',
    server: 'aws-sql-server-db.c7i6un41glyu.ap-southeast-1.rds.amazonaws.com',
    database: 'IMPOSTER',
});

const poolConnection = pool.connect();

module.exports = {sql, pool, poolConnection}

