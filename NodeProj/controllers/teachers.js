const teachers        = require('../models').teachers;


exports.createIfNotExist = async (emails) => {

    let bool = false;
    let existing = await this.findByEmail(emails);
    let existingemails = [];

    if (existing.length > 0){
    	existing.forEach(async (teach) =>{
       		existingemails.push(teach.teacher_email);
    	});
    }

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
  try{
    let results = await teachers.create({  
                teacher_email: email,
                status: 1
              });
    return true;
  }catch(err){
    return err;
  }
};

// fetch all teachers
exports.findAll = (req, res) => {
  teachers.findAll({attributes: ['teacher_email', 'status']}).then(teacher => {
    res.send(teacher);
  });
};

exports.findByEmail = async (emails) => {  
  let data = undefined;

  data = await teachers.findAll({attributes: ['teacher_email', 'status'], where: { teacher_email : emails }})

  return data;
};

 
// Suspend/In-active a teacher
exports.update = (req, res) => {
  const email = req.body.teacher;
  teachers.update( { status: 0 }, 
           { where: {email: email} }
           ).then(() => {
           res.status(200).send("updated successfully a teachers with email = " + email);
           });
};
 