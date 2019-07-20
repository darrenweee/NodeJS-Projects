
let student = require('../controllers/students');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

let path = '/api';

  describe('/POST register', () => {
      it('it should successfully register with unique teacher & students field', (done) => {
        // let key = 'teacherken' + Math.floor(Math.random() * 101) + "@example.com";
          let req = {
              teacher: "teacherken@example.com",
              students: [
                          "commonstudent1@example.com",
                          "commonstudent2@example.com",
                          "kenstudent1@example.com"
                        ]
          }
        chai.request(app)
            .post(path + '/register')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
              done();
            });
      });

      it('it should successfully register with another unique teacher & students field', (done) => {
        // let key = 'teacherken' + Math.floor(Math.random() * 101) + "@example.com";
          let req = {
              teacher: "teacherjoe@example.com",
              students: [
                          "commonstudent1@example.com",
                          "commonstudent2@example.com",
                          "joestudent1@example.com",
                          "joestudent2@example.com"
                        ]
          }
        chai.request(app)
            .post(path + '/register')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
              done();
            });
      });

      it('it should fail to register without teachers field', (done) => {
          let req = {
              students: [
                          "commonstudent1@example.com",
                          "commonstudent2@example.com"
                        ]
          }
        chai.request(app)
            .post(path + '/register')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

      it('it should successfully register with a unique teachers field but without students field', (done) => {
          let key = 'teacherken' + Math.floor(Math.random() * 101) + "@example.com";
          let req = {
              teacher: key
          }
        chai.request(app)
            .post(path + '/register')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
              done();
            });
      });

  });


describe('/GET commonstudents', () => {
      it('it should get all the students when only 1 teacher is passed in', (done) => {
        chai.request(app)
            .get(path + '/commonstudents')
            .query({teacher: 'teacherken@example.com'})
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('students');
              done();
            });
      });

      it('it should get only the COMMON students when 2 teacher is passed in', (done) => {
        chai.request(app)
            .get(path + '/commonstudents')
            .query({teacher: ['teacherken@example.com','teacherjoe@example.com']})
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('students');
              done();
            });
      });

  });

  describe('/POST suspend', () => {
      it('it should successfully suspend a student', (done) => {
          let req = {
              "student" : "joestudent1@example.com"
          }
        chai.request(app)
            .post(path + '/suspend')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
              done();
            });
      });

      it('it should fail to suspend a student when he is alrdy suspended', (done) => {
          let req = {
              "student" : "joestudent1@example.com"
          }
        chai.request(app)
            .post(path + '/register')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

      it('it should fail to suspend a student when the data does not exist in the table', (done) => {
          let req = {
              "student" : "idunexist@example.com"
          }
        chai.request(app)
            .post(path + '/register')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

  });

  describe('/POST retrievefornotifications', () => {
      it('it should successfully retrieve with a teacher & notification field', (done) => {

          let req = {
            "teacher":  "teacherken@example.com",
            "notification": "Hello students! @joestudent1@example.com @joestudent2@example.com"
          }

        chai.request(app)
            .post(path + '/retrievefornotifications')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('recipients');
              done();
            });
      });

      it('it should successfully retrieve with a teacher & without notification field', (done) => {
          let req = {
            "teacher":  "teacherken@example.com"
          }
        chai.request(app)
            .post(path + '/retrievefornotifications')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('recipients');
              done();
            });
      });

      it('it should fail to retrieve without a teacher but with a notification field', (done) => {
          let req = {
            "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
          }
        chai.request(app)
            .post(path + '/retrievefornotifications')
            .send(req)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

  });

