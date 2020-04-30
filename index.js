const express = require('express');
const bodyParser = require('body-parser').json();
const mysql = require('mysql');

const app = express();
app.use(express.json());

/////////////////////////////////////////// MySQL //////////////////////////////////////////////

var database = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "test"
});

var isConnected = false;

database.connect(function(error){
	if(error)
	{
		throw error;
	}

	console.log("Database Connected");
	isConnected = true;
	//insert();
});

function insert(sql)//name,age,permission)
{
	console.log("SQL : "+sql);
	if(isConnected)
	{
		//sql = "INSERT INTO `user`(`name`,`age`,`permission`) VALUES ('"+name+"','"+age+"','"+permission+"')";
                database.query(sql,(error,result)=>{
			if(error)
			{
				throw error;
			}

			console.log("insert completed");
		});
	}
	else
	{
		console.log("Database is not connect");
	}
}

function select(sql)//name,age,permission)
{
	//console.log("SQL : "+sql);
	if(isConnected)
	{
		
                database.query(sql,(error,result)=>{
			if(error)
			{
				throw error;
			}

			console.log(result);
		});
	}
	else
	{
		console.log("Database is not connect");
	}
}

/////////////////////////////////////////// API //////////////////////////////////////////////////
var users = [
	{
		id: 1,
		name: "Raksit Panwong",
		age: 32,
		permission:1
	},
	{
		id: 2,
		name: "CODESMASH",
		age: 5,
		permission:2
	}
];

app.get('/api/users',bodyParser, (req,res)=>{
	res.send(users);
	sql = "SELECT * FROM `user`";
	select(sql);
});

app.post('/api/users',bodyParser, (req,res)=>{
	var new_user = {
		id: users.length+1,
		name: req.body.name,
		age: req.body.age,
		permission: req.body.permission

	};
	//console.log(req);
	sql = "INSERT INTO `user`(`name`,`age`,`permission`) VALUES ('Net','44','2')";
	console.log(insert(sql));
	console.log(req.body);
	users.push(new_user);
	res.send(users);
});



const port = process.env.PORT || 3002;
app.listen(port,()=> console.log("CODESMASH API running on port 3002"));

