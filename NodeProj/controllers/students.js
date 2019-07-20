const students        = require('../models').students;


exports.createIfNotExist = async (emails) => {
    let bool = false;
    let existing = await this.findByEmail(emails);
    let existingemails = [];
    if (existing.length > 0){
      existing.forEach(function (stud){
         existingemails.push(stud.student_email);
      });
    };

    if (existingemails.length !== emails.length){

      for (let i = 0 ; i < emails.length; i++){
         if (!existingemails.includes(emails[i])){
            bool = await this.create(emails[i]);
        }
      }
      return bool;
        
    }else{
      return true;
    }
}


exports.create = async (email) => {  

  // db.sequelize.query("INSERT INTO teachers_students (teacher_email, student_email) VALUES (?,?);",{ replacements: [fmteacher, fmstudents], type: db.sequelize.QueryTypes.INSERT }
  try{
    let results = await students.create({  
                student_email: email,
                status: 1
              });
    return true;
  }catch(err){
    return false;
  }

};

//fetch all students
exports.findAll = (req, res) => {
  students.findAll({attributes: ['student_email', 'status']}).then(student => {
    res.send(student);
  });
};
 
// Find a student by email
exports.findByEmail = async (emails) => {  
  let data = undefined;

  data = await students.findAll({attributes: ['student_email', 'status'], where: { student_email : emails }})

  return data;
};
 

exports.suspend = async (req, res) => {

  if (req.body.student === undefined){
    return res.json({ error : "need at least one student"});
  }

  let errorMsg = undefined;
  let data = undefined;
  let email = req.body.student.replace(/[\[\]!#$%^&*\"]/g, "").trim();
  try{

    var checkdata = await this.findByEmail(email);
    //if student dun exist
    if (checkdata.length > 0){
      //if alrdy suspended
      if (checkdata[0].status !== 0){
          //start to suspend
          data = await students.update( { status: 0 },
          { where: {student_email: email} }, {fields: ['status']});
      }else{
        return res.json({ error : "studenthas alrdy been suspended"});
      }
    }else{
       return res.json({ error : "student's data not existing"});
    }

  }catch(err){
     errorMsg = { name : err.name,
               description : err.errors};
  }

  return res.json({
    error: errorMsg,
    message: "suspended a student with email : " + email
  });
  
};

exports.checkIfSuspended = async (emails) => {  
  let data = undefined;
  data = await students.findAll({attributes: ['student_email','status'], where: { student_email : emails }});
  return data;
};

