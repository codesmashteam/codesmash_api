const express = require('express');

const app = express();
app.use(express.json());

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

app.get('/api/users',(req,res)=>{
	res.send(users);
});

app.post('/api/register',(req,res)=>{
	var new_user = {
		id:3,

	};

	users.push(new_user);
	res.send(users);
});



const port = process.env.PORT || 3002;
app.listen(port,()=> console.log("CODESMASH API running on port 3002"));
