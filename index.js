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
	// console.log("SQL : " + sql);
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
		sql += " WHERE `user_id` = '" + userid + "'";
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
	sql = "SELECT * FROM shift INNER JOIN user ON shift_user_id=user.user_id INNER JOIN main_shift ON shift_main_id=main_shift.main_shift_id WHERE shift_user_id =" + user_id;
	const result = select(sql, res);

});


app.get('/api/userInShift', cors(), bodyParser, async (req, res) => {
	shift_date = req.query.shift_date;
	user_id = req.query.user_id;
	sql = "SELECT * FROM shift INNER JOIN user ON shift_user_id=user.user_id WHERE shift_user_id !=" + user_id + " AND `shift_date` = '" + shift_date + "'";
	const result = select(sql, res);
});

app.get('/api/getMainShift', cors(), bodyParser, (req, res) => {
	shift_date = req.query.date;
	shift_main_id = req.query.shift_main_id;
	getMainShift(shift_date, shift_main_id, res);
});


app.get('/api/userInMainShift', cors(), bodyParser, (req, res) => {

	main_shift_id = req.query.main_shift_id;
	getUserMainShift(main_shift_id, res);
});


async function getUserMainShift(main_shift_id, res) {
	sql = "SELECT * FROM shift WHERE `shift_main_id` = '" + main_shift_id + "'";
	const respones = [];
	if (isConnected) {
		console.log("SQL :" + sql)
		database.query(sql, (error, result) => {
			if (error) {
				throw error;
			} else {
				res.send(result);

			}
		});


	}
	else {
		console.log("Database is not connect");
	}
}
// var async = require('async');
async function getMainShift(shift_date, shift_main_id, res) {
	sql = "SELECT * FROM main_shift WHERE `main_shift_id` = '" + shift_main_id + "'";
	const respones = [];
	if (isConnected) {
		console.log("SQL :" + sql)
		database.query(sql, (error, result) => {
			if (error) {
				throw error;
			} else {

				res.send(result);
				// mainShiftRows = JSON.parse(JSON.stringify(result))
				// mainShiftRows.forEach(element => {
				// 	console.log("---------------------loop-----------------------")
				// 	sql_loop = "SELECT * FROM shift WHERE shift_main_id=" + element.main_shift_id + " AND shift_user_id !=" + user_id;
				// 	console.log("SQL : " + sql_loop)
				// 	database.query(sql_loop, (error2, result2) => {
				// 		if (error2) {
				// 			throw error2;
				// 		} else {
				// 			console.log("---------------------shiftRows---------------------");
				// 			shiftRows = JSON.parse(JSON.stringify(result2))
				// 			console.log(shiftRows)
				// 			// return shiftRows;
				// 		}
				// 	});

				// });
				// console.log("---------------------respones---------------------");
				// console.log(respones);
			}
		});

		// let resultRows = Array();
		// const result = database.query(sql, async function (err, rows, fields) {
		// 	console.log("---------------------result---------------------")
		// 	// mainShiftRows = JSON.parse(JSON.stringify(result))
		// 	console.log(rows)

		// 	async.each(rows, function (row, callback) {
		// 		sql_loop = "SELECT * FROM shift WHERE shift_main_id=" + row.main_shift_id + " AND shift_user_id !=" + user_id;
		// 		database.query(sql_loop, function (err, innerRow) {
		// 			resultRows.push(innerRow);
		// 			callback(null);
		// 		});
		// 	}, async function () {
		// 		//This is the final function which get executed when loop is done.
		// 		const response = {
		// 			statusCode: 200,
		// 			headers: {
		// 				"Access-Control-Allow-Origin": "*" // Required for CORS support to work
		// 			},
		// 			body: JSON.stringify({
		// 				success: true,
		// 				data: resultRows
		// 			})
		// 		};
		// 		callback(null, response);
		// 	});
		// });
	}
	else {
		console.log("Database is not connect");
	}
}






const port = process.env.PORT || 3002;
app.listen(port, () => console.log("CODESMASH API running on port 3002"));

