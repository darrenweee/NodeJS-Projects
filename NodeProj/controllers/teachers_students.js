let teachers_students       = require('../models').teachers_students;
let studentscontroller = require('../controllers/students.js');
let teacherscontroller = require('../controllers/teachers.js');

// let db       = require('../models/index.js');

//remove duplicates between 2 arrays
function arrayUnique(array) {
    let a = array.concat();
    for(let i=0; i<a.length; ++i) {
        for(let j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


exports.create = async (req, res) => {  

  //check if pri key is undefined
  if (req.body.teacher === undefined){
    return res.json({ error : "Primary key cannot be empty"});
  }

  let fmteacher = JSON.stringify(req.body.teacher).replace(/[\[\]!#$%^&*\"]/g, "").trim();
  let fmstudents = req.body.students;

  if (fmstudents !== undefined){
    fmstudents = JSON.stringify(fmstudents).replace(/[\[\]!#$%^&*\"]/g, "").trim();
  }else{
    fmstudents = '';
  }
  
  let errorMsg = undefined;
  let data = undefined;
  let bool = false;
  let response = {};

  // db.sequelize.query("INSERT INTO teachers_students (teacher_email, student_email) VALUES (?,?);",{ replacements: [fmteacher, fmstudents], type: db.sequelize.QueryTypes.INSERT }

  try{
    //create if student dun exist in db
    bool = await studentscontroller.createIfNotExist(fmstudents.split(","));
    //create if teacher dun exist in db
    bool = await teacherscontroller.createIfNotExist(fmteacher.split(","));


    if (bool){
      data = await teachers_students.create({  
                teacher_email: fmteacher,
                student_email: fmstudents
              });
    }

  }catch(err){
    errorMsg = { name : err.name,
                 description : err.errors};
  }
  //format response
  if (errorMsg === undefined){
    // let temp = {}

    response.message = "Successfully added data";
    // temp.teacher = data.teacher_email;
    // temp.students = data.student_email;
    // response.data = temp;
  }else{
    response.error = errorMsg;
  }

  return res.json(response);

  
};

 
// fetch all teacher_student
exports.findAll = async (req, res) => {

  let errorMsg = undefined;
  let data = undefined;

  try{
    data = await teachers_students.findAll({attributes: ['teacher_email', 'student_email']});
  }catch(err){
     errorMsg = { name : err.name,
                 description : err.errors};
  }

  return res.json({
      error: errorMsg,
      data: data
    });
};

exports.findCommon = async (req, res) => {

  let fmteacher = req.param('teacher','');
  let commonArr = undefined;
  let errorMsg = undefined;

  try{
    const tsresults = await teachers_students.findAll({attributes: ['teacher_email', 'student_email'], where: { teacher_email : fmteacher }});

      //retrieve all data and add to object
      let compiledData = {};
      tsresults.forEach(function(ts){
        if (!(ts.teacher_email in compiledData)){
          let arr = ts.student_email.split(",");
          compiledData[ts.teacher_email] = arr;
        }
      });

      // find the common students
      for (let key in compiledData) {
          if (commonArr === undefined){
            commonArr = compiledData[key];
          }else{
            commonArr = commonArr.filter(x => compiledData[key].includes(x));
          }
      }
    }catch(err){
       errorMsg = { name : err.name,
                 description : err.errors};
    }

    return res.json({
      error: errorMsg,
      students: commonArr
    });

};

exports.findRecipients = async (req, res) => {

  //check if teacher is undefined
  if (req.body.teacher === undefined){
    return res.json({ error : "Teacher cannot be empty"});
  }

  let recipients = [];
  let fmteacher = req.body.teacher.replace(/[\[\]!#$%^&*\"]/g, "").trim();
  let fmmessage = req.body.notification;
  let pattern = /\S+[a-z0-9]@[a-z0-9\.]+/img;
  let temp = undefined;

  if (fmmessage !== undefined){
    temp = fmmessage.match(pattern);
  }

  let data = undefined;
  let errorMsg = undefined;
  

  if (temp !== null && temp !== undefined){
    temp.forEach(function(student){
        //add to recipients if tagged with @
        if (student.charAt(0) === "@"){
          recipients.push(student.substr(1));
        }
      });
   }

   try{

      data = await teachers_students.findAll({attributes: ['teacher_email', 'student_email'], where: { teacher_email : fmteacher }});

      data.forEach(function(ts){
            let arr = ts.student_email.split(",");
            let tempArr = [];
            
            for (let value in arr) {
              if (tempArr.indexOf(arr[value]) < 0){
                tempArr.push(arr[value]);
              }
            }
            recipients = arrayUnique(recipients.concat(tempArr));
        });

      //remove from recipients if alrdy suspended
      let studentresults = await studentscontroller.checkIfSuspended(recipients);
      studentresults.forEach(function(stud){
        if (stud.status === 0){
          recipients.splice(recipients.indexOf(stud.student_email), 1);
        }
      });

   }catch(err){
       errorMsg = { name : err.name,
                 description : err.errors};
    }

    return res.json({
      error: errorMsg,
      recipients: recipients
    });
};
