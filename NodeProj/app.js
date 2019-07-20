const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = require('./dbcontroller');

const hostname = '127.0.0.1';
const port = 3000;

var teacherscontroller = require('./controllers/teachers.js');
var tscontroller = require('./controllers/teachers_students.js');
var studentscontroller = require('./controllers/students.js');


var pathhome = '/api';

app.get(pathhome + '/teachers', tscontroller.findAll)

app.get(pathhome + '/commonstudents', function (req, res) {
	tscontroller.findCommon(req, res);

})

app.post('/api/register', tscontroller.create);

app.post('/api/suspend', studentscontroller.suspend);

app.post('/api/retrievefornotifications', tscontroller.findRecipients);


app.listen(process.env.PORT || port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;