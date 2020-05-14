const express = require('express');
const bodyParser = require('body-parser').json();
const mysql = require('mysql');
const cors = require('cors');
const querystring = require('querystring');

const app = express();

app.use(express.json());
app.use(cors()); // for crossdomain


/////////////////////////////////////////// MySQL //////////////////////////////////////////////

var database = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "nurse_api"
});

var isConnected = false;

database.connect(function (error) {
	if (error) {
		throw error;
	}

	console.log("Database Connected");
	isConnected = true;
	//insert();
});

function insert(sql)//name,age,permission)
{
	//console.log("SQL : "+sql);
	if (isConnected) {
		//sql = "INSERT INTO `user`(`name`,`age`,`permission`) VALUES ('"+name+"','"+age+"','"+permission+"')";
		database.query(sql, (error, result) => {
			if (error) {
				throw error;
			}

			console.log("insert completed");
		});
	}
	else {
		console.log("Database is not connect");
	}
}

async function select(sql, res) {
	console.log("SQL : " + sql);
	if (isConnected) {

		database.query(sql, (error, result) => {
			if (error) {

				throw error;
			} else {
				// return result
				// console.log(result);
				res.send(result);
			}

		});
	}
	else {
		console.log("Database is not connect");
	}
}

/////////////////////////////////////////// API //////////////////////////////////////////////////

app.get('/api/users', cors(), bodyParser, async (req, res) => {

	userid = req.query.id;

	sql = "SELECT * FROM `user`";
	if (userid != null) {
		sql += " WHERE `id` = '" + userid + "'";
	}
	select(sql, res);

});

app.post('/api/users', cors(), bodyParser, (req, res) => {
	var new_user = {
		name: req.body.name,
		age: req.body.age,
		permission: req.body.permission
	};

	sql = "INSERT INTO `user`(`name`,`age`,`permission`) VALUES ('" + new_user[0] + "','" + new_user[1] + "','" + new_user[2] + "')";
	insert(sql);
	console.log(req.body);

	//========= GET NEW USER LIST ========//
	select_sql = "SELECT * FROM `user`";
	select(select_sql, res);
	//====================================//


});

app.delete('/api/users', cors(), bodyParser, async (req, res) => {

	userid = req.query.id;

	sql = "DELETE FROM `user`";
	if (userid != null) {
		sql += " WHERE `id` = '" + userid + "'";
	}
	select(sql, res);

});
////////////////////////////////////////// PAT DEV //////////////////////////////////////////////
app.get('/api/shifts', cors(), bodyParser, async (req, res) => {

	shiftid = req.query.id;

	sql = "SELECT * FROM shift INNER JOIN user ON shift_user_id=user.user_id";
	if (shiftid != null) {
		sql += " WHERE `shift_id` = '" + shiftid + "'";
	}
	const result = select(sql, res);

});

app.get('/api/getShift', cors(), bodyParser, async (req, res) => {

	user_id = req.query.id;
	sql = "SELECT * FROM shift INNER JOIN user ON shift_user_id=user.user_id WHERE shift_user_id =" + user_id;
	const result = select(sql, res);

});


app.get('/api/userInShift', cors(), bodyParser, async (req, res) => {
	shift_date = req.query.shift_date;
	user_id = req.query.user_id;
	sql = "SELECT * FROM shift INNER JOIN user ON shift_user_id=user.user_id WHERE shift_user_id !=" + user_id + " AND `shift_date` = '" + shift_date + "'";
	const result = select(sql, res);
});







const port = process.env.PORT || 3002;
app.listen(port, () => console.log("CODESMASH API running on port 3002"));

