const mysql = require('mysql')
module.exports = mysql.createPool({
    host: '124.221.80.208',
    user: 'root',
    password: '132333zzz...hhh',
    database: 'wx_post',
    multipleStatements: true,
})