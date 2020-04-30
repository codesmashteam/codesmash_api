const express = require('express');
const router = express.Router();

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

router.get('/api/users', (req,res)=>{
	res.send(users);
});

router.post('/api/users', (req,res)=>{
	var new_user = {
		id: users.length+1,
		name: req.body.name,
		age: req.body.age,
		permission: req.body.permission

	};
	//console.log(req);
	console.log(req.body);
	users.push(new_user);
	res.send(users);
});