var express = require('express'); // Web Framework
var app = express();
var sql = require('mssql'); // MS Sql Server client
// Connection string parameters.
var sqlConfig = {
  user: 'username',
  password: 'secert',
  server: '127.0.0.1',
  database: 'mydb'
}
// Start server and listen on http://localhost:8081/
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("app listening at http://%s:%s", host, port)
});
//Get some database values
app.get('/data', function (req, res) {
    new sql.ConnectionPool(sqlConfig).connect().then(pool => {
        return pool.request().query("SELECT * FROM mytable")
        }).then(result => {
          let rows = result.recordset
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.status(200).json(rows);
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: {err}})
          sql.close();
        });
})