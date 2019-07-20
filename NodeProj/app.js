// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// var dbcontroller = require('./dbcontroller.js');
// dbcontroller.connectToDB('34.80.138.42', 'user', 'P@ssw0rd', 'eternal-insight-247107:asia-east1:darren-school');
const connection = require('./dbcontroller');

const hostname = '127.0.0.1';
const port = 3000;

var teacherscontroller = require('./controllers/teachers.js');
var tscontroller = require('./controllers/teachers_students.js');
var studentscontroller = require('./controllers/students.js');


var pathhome = '/api';

app.get(pathhome, function (req, res) {
  res.send('Hello World');
})

app.get(pathhome + '/teachers', tscontroller.findAll)

// GET method route
app.get(pathhome + '/commonstudents', function (req, res) {
	tscontroller.findCommon(req, res);


		  // var user_id = req.body.id;
		  // var token = req.body.token;
		  // var geo = req.body.geo;
		  // res.send('GET request to the homepage')

		  // var user_id = req.param.id;
		  // var token = req.param.token;
		  // var geo = req.param.geo;
		  // res.send(user_id + ' ' + token + ' ' + geo);
	 //  	var teachers = req.param('teacher','');
	 //  	var compiledStudents = {};

	 //  	// var sqlquery = "select t1.student_email from ( " + 
		// 		// 		"select s.student_email FROM students s, teachers t, teachers_students ts " + 
		// 		// 		"where s.student_email = ts.student_email and t.teacher_email = ts.teacher_email and ts.teacher_email = '" + teacher[0] +"') t1 " + 
		// 		// 		"INNER JOIN ( " + 
		// 		// 		"select s.student_email FROM students s, teachers t, teachers_students ts " + 
		// 		// 		"where s.student_email = ts.student_email and t.teacher_email = ts.teacher_email and ts.teacher_email = '" + teacher[1] +"' ) t2 " +
		// 		// 		"ON t1.student_email = t2.student_email ";

		// console.warn(teachers);

		// teachers.forEach(teacher => {

		// 	connection.query("SELECT * FROM teachers_students WHERE teacher_email = ?",teacher, function (error, results) {

		//   	if (error) throw error;

		// 	results = JSON.parse(JSON.stringify(results));

		// 	var arr = [];

		// 	for (var j = 0; j < results.length; j++) {
		// 		arr.push(results[j].student_email);
		// 	}

		// 	compiledStudents[teacher] = arr;

		//   });

		// });

	 //  	res.send(compiledStudents);
		
	  // res.send(user_id + ' ' + token + ' ' + geo);
})


// POST http://localhost:8080/api/users
// parameters sent with 
// app.post('/api/users', function(req, res) {
//     var user_id = req.body.id;
//     var token = req.body.token;
//     var geo = req.body.geo;

//     res.send(user_id + ' ' + token + ' ' + geo);
// });

app.post('/api/register', tscontroller.create);

app.post('/api/suspend', studentscontroller.suspend);

app.post('/api/retrievefornotifications', tscontroller.findRecipients);

app.post('/api/users', function(req, res) {
    var email = req.body.email;

    res.send(email);
});

app.listen(process.env.PORT || port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;