var logger = require('winston');
var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var seed = require('../../seed/seed');
var User = require('../../models/user');
var expect = require('chai').expect;
var assert = require('chai').assert;

chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:8001';

function getUserForTesting() {
  return {
        "gender": "female",
        "name": {
          "title": "miss",
          "first": "alison",
          "last": "reid"
        },
        "location": {
          "street": "1097 the avenue",
          "city": "Newbridge",
          "state": "ohio",
          "zip": 28782
        },
        "email": "alison.reid@example.com",
        "username": "tinywolf709",
        "password": "rockon",
        "salt": "lypI10wj",
        "md5": "bbdd6140e188e3bf68ae7ae67345df65",
        "sha1": "4572d25c99aa65bbf0368168f65d9770b7cacfe6",
        "sha256": "ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4eb",
        "registered": 1237176893,
        "dob": 932871968,
        "phone": "031-541-9181",
        "cell": "081-647-4650",
        "PPS": "3302243T",
        "picture": {
          "large": "https://randomuser.me/api/portraits/women/60.jpg",
          "medium": "https://randomuser.me/api/portraits/med/women/60.jpg",
          "thumbnail": "https://randomuser.me/api/portraits/thumb/women/60.jpg"
        }
      };
}

function getUpdateQuery() {
  return {
    "gender": "female",
    "name": {
      "title": "miss",
      "first": "ison",
      "last": "id"
    },
    "location": {
      "street": "97 the avenue",
      "city": "wbridge",
      "state": "io",
      "zip": 782
    },
    "email": "ison.reid@example.com",
    "username": "nywolf709",
    "password": "ckon",
    "salt": "pI10wj",
    "md5": "dd6140e188e3bf68ae7ae67345df65",
    "sha1": "72d25c99aa65bbf0368168f65d9770b7cacfe6",
    "sha256": "0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4eb",
    "registered": 37176893,
    "dob": 2871968,
    "phone": "1-541-9181",
    "cell": "1-647-4650",
    "PPS": "02243T",
    "picture": {
      "large": "tps://randomuser.me/api/portraits/women/60.jpg",
      "medium": "tps://randomuser.me/api/portraits/med/women/60.jpg",
      "thumbnail": "tps://randomuser.me/api/portraits/thumb/women/60.jpg"
    }
  };
}

describe('Users', function() {

  // Before our test suite
  before(function(done) {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, function() {
      logger.info('Listening at http://localhost:8001 for acceptance tests');

      // Seed the DB with our users
      seed(function(err) {
        done(err);
      });
    });
  });
  
  /* after(function(done) {
    if(delete userForTesting)
      console.log('deleted userForTesting var');
  }); */

  describe('/GET users', function() {
    it('should return a list of users', function(done) {
      chai.request(url)
        .get('/users')
        .end(function(err, res) {
          res.body.should.be.a('array');
          res.should.have.status(200);
          res.body.length.should.be.eql(100);
          done();
        });
    });
  });
  
  //delete all users
  describe('/GET deleteall', function() {
    it('should delete all users and return empty array', function(done) {
      chai.request(url)
        .get('/deleteall')
        .end(function(err, res) {
          console.log('got respond');
          //console.log(res);
          res.should.have.status(200);
          User.find({}, function(err, users) {
            if (err) {
              return res.status(500).json({
                error: "Error listing users: " + err
              });
            }

            assert.equal(users.length,0);
            done();
          });
        });
    });
  });
  
  describe('/GET users/:id', function() {
    it('should return a single user', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {
        var id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/users/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('array');
            assert.equal(res.body.length,1);
            expect(res.body[0].name.first).to.be.a('string');
            done();
          });
      });
    });
  });
  
  describe('/POST users/createuser', function() {
    it('should create a new user', function(done) {
      var userForTesting = getUserForTesting();
      
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(userForTesting)
      .end(function(error, res, body) {
          if (error) {
              done(error);
          } else {
              //console.log("Chai: create test: id: " + res.body + ", type: " + typeof res.body);
              assert.isOk(typeof res.body === 'object');              
              assert.equal(res.body['createStatus'],'user created');
              
              User.findById(res.body['userId'], function (err, user){
                  if (err) throw err;
                  //console.log(user);
                  
                  //assert.deepEqual(userForTesting,user);
                  /* for(var attr in user) {
                    console.log(attr);
                    assert.isOk(userForTesting.attr !== undefined);
                    assert.deepEqual(user.attr,userForTesting.attr);
                  } */
                  
                  ["gender","name","location","email","username","password","salt","md5","sha1","sha256","registered","dob","phone","cell","PPS","picture"].forEach(function(attrToTest) {
                    //console.log(attrToTest);
                    //console.log(user[attrToTest]);
                    //console.log(userForTesting[attrToTest]);
                    assert.isOk(user[attrToTest] !== undefined);
                    assert.isOk(userForTesting[attrToTest] !== undefined);                    
                    assert.isOk(typeof user[attrToTest] === typeof userForTesting[attrToTest]);
                    assert.deepEqual(user[attrToTest],userForTesting[attrToTest]);
                  });
                  done();
              });
          }
      });       
      
    });
  });
  
  //create users with duplicate username, email, pps
  /* describe('/POST users/createuser', function() {
    it('should create a new user', function(done) {
      var userForTesting = getUserForTesting();
      
      
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(userForTesting)
      .end(function(error, res, body) {
          if (error) {
              done(error);
          } else {
              console.log("create the testing user 1st time");
              console.log("now create the testing user 2nd time");
              chai.request(url)
              .post('/users/createuser')
              .set('content-type', 'application/json')
              .send(userForTesting)
              .end(function(error, res, body) {
                  if (error) {
                      done(error);
                  } else {
                      console.log("user created 2nd time");
                      assert.isOk(typeof res.body === 'object');
                      assert.equal(res.body['createStatus'], 'user existed');                     
                      assert.equal(res.body['userId'],undefined);                    
                  }
              });    
          }
      });       
      
    });
  }); */
  
  // create user, delete created user, verify
  describe('/GET users/deleteuser/:id', function() {
    it('should delete a single user', function(done) {     
      //create user
      var userForTesting = getUserForTesting();  
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(userForTesting)
      .end(function(error, res, body) {
          if (error) {
              done(error);
          } else {
            var userId = res.body['userId'];
            console.log(typeof userId);
            //delete user
            chai.request(url)
            .get('/users/deleteuser/' + userId)
            .end(function(err, res) {
              assert.isOk(typeof res.body === 'string');
              assert.equal(res.body, 'user deleted');
              done();
            });
          }
      });     
      
    });
  });
  
  
  
  // update - ideal case, test: create a user, update that user and verify
  describe('/POST users/updateuser', function() {
    it('should update a user', function(done) {
          
      //First create user
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(getUserForTesting())
      .end(function(error, res, body) {
          if (error) {
              done(error);
          } else {
            
            //Then update the created user
            var updateRequestBody = {userId: res.body['userId'], updateQuery: getUpdateQuery()};
            
            chai.request(url)
            .post('/users/updateuser')
            .set('content-type', 'application/json')
            .send(updateRequestBody)
            .end(function(error, res, body) {
                if (error) {
                    done(error);
                } else {                    
                  //{ ok: 1, nModified: 1, n: 1 }
                  assert.equal(res.body['ok'],1);
                  assert.equal(res.body['nModified'],1);
                  assert.equal(res.body['n'],1);
                  done();
                }
            });       
          }
        });
      }); 
      
      
      
  });
  
  //update user that doesn't exist
  
  //update user with invalid query
  
});
