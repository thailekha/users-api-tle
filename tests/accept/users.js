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

//return a sample user for testing
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
    "email": "superwierdemail",
    "username": "superwierdusername",
    "password": "rockon",
    "salt": "lypI10wj",
    "md5": "bbdd6140e188e3bf68ae7ae67345df65",
    "sha1": "4572d25c99aa65bbf0368168f65d9770b7cacfe6",
    "sha256": "ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4eb",
    "registered": 1237176893,
    "dob": 932871968,
    "phone": "031-541-9181",
    "cell": "081-647-4650",
    "PPS": "123321123321",
    "picture": {
      "large": "https://randomuser.me/api/portraits/women/60.jpg",
      "medium": "https://randomuser.me/api/portraits/med/women/60.jpg",
      "thumbnail": "https://randomuser.me/api/portraits/thumb/women/60.jpg"
    }
  };
}

//return an object having same structure as user model for updating
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

//remove all users in database, a reset mechansim for some tests
function removeAllUsers() {
  User.remove({}, function(err) {
    //console.log("ALL USERS REMOVED");
    if (err) {
      throw err;
    }
  });
}

//a utility function for the test for duplicate users when updating. takes in an array of paths (eg. ['/users/createuser','/users/updateuser']); test objects that can be user or an update query; and callbacks to be executed
function chaiRequestCreateUser(paths, testObjects, callbacks) {
  if (testObjects.length > 0 && paths.length > 0 && callbacks.length > 0) {
    var testObject = testObjects.shift();
    chai.request(url)
    .post(paths.shift())
    .set('content-type', 'application/json')
    .send(testObject)
    .end(function(error, res) {
      if (error) {
        done(error);
      } else {
        //callback is responsible for revoking c if needed
        callbacks.shift()(testObjects, testObject, res);
        chaiRequestCreateUser(paths, testObjects, callbacks);
      }
    });
  }
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
          assert.equal(res.body.length, 1);
          expect(res.body[0].name.first).to.be.a('string');
          done();
        });
      });
    });
  });

  //delete all users
  describe('/DELETE deleteall', function() {
    it('should delete all users and return empty array', function(done) {
      chai.request(url)
      .delete('/deleteall')
      .end(function(err, res) {
        res.should.have.status(200);
        User.find({}, function(err, users) {
          if (err) {
            return res.status(500).json({
              error: "Error gathering users:: " + err
            });
          }
          assert.equal(users.length, 0);
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
      .end(function(error, res) {
        if (error) {
          done(error);
        } else {
          res.should.have.status(200);
          assert.isOk(typeof res.body === 'object');
          assert.equal(res.body['createStatus'], 'user created');

          //The response after creating the user contains new user's id, use this id to find the user object in database and check against the user object used for creating
          User.findById(res.body['userId'], function(err, user) {
            if (err) {
              throw err;
            }

            //Check all attibutes
            ["gender", "name", "location", "email", "username", "password", "salt", "md5", "sha1", "sha256", "registered", "dob", "phone", "cell", "PPS", "picture"].forEach(function(attrToTest) {
              assert.isOk(user[attrToTest] !== undefined);
              assert.isOk(userForTesting[attrToTest] !== undefined);
              assert.isOk(typeof user[attrToTest] === typeof userForTesting[attrToTest]);
              assert.deepEqual(user[attrToTest], userForTesting[attrToTest]);
            });
            done();
          });
        }
      });

    });
  });

  //users with duplicate username, email, pps are not allowed
  describe('/POST users/createuser', function() {
    it('creating users with duplicate username, email, pps are not allowed', function(done) {
      removeAllUsers();
      var userForTesting = getUserForTesting();
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(userForTesting)
      .end(function(error) {
        if (error) {
          done(error);
        } else {
          chai.request(url)
          .post('/users/createuser')
          .set('content-type', 'application/json')
          .send(userForTesting)
          .end(function(error, res) {
            if (error) {
              done(error);
            } else {
              res.should.have.status(200);
              assert.isOk(typeof res.body === 'object');
              assert.equal(res.body['createStatus'], 'user existed');
              assert.equal(res.body['userId'], undefined);
              done();
            }
          });
        }
      });

    });
  });


  // create user, delete created user, verify
  describe('/DELETE users/deleteuser/:id', function() {
    it('should delete a single user', function(done) {
      removeAllUsers();
      //create user
      var userForTesting = getUserForTesting();
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(userForTesting)
      .end(function(error, res) {
        if (error) {
          done(error);
        } else {
          var userId = res.body['userId'];
          //delete user
          chai.request(url)
          .delete('/users/deleteuser/' + userId)
          .end(function(err, res) {
            res.should.have.status(200);
            assert.isOk(typeof res.body === 'string');
            assert.equal(res.body, 'user deleted');
            done();
          });
        }
      });
    });
  });

  // update
  describe('/POST users/updateuser', function() {
    it('should update a user', function(done) {
      removeAllUsers();
      //First create user
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(getUserForTesting())
      .end(function(error, res) {
        if (error) {
          done(error);
        } else {

          //Then update the created user
          var updateRequestBody = {userId: res.body['userId'], updateQuery: getUpdateQuery()};

          chai.request(url)
          .post('/users/updateuser')
          .set('content-type', 'application/json')
          .send(updateRequestBody)
          .end(function(error, res) {
            if (error) {
              done(error);
            } else {
              //{ ok: 1, nModified: 1, n: 1 }
              res.should.have.status(200);
              assert.equal(res.body['ok'], 1);
              assert.equal(res.body['nModified'], 1);
              assert.equal(res.body['n'], 1);
              done();
            }
          });
        }
      });
    });
  });

  //update a user with a query that could potentially make him/her duplicate with other user
  describe('/POST users/updateuser', function() {
    it('should avoid updating a user with an email that could potentially make him/her duplicate with other user', function(done) {
      removeAllUsers();
      //First create users
      var user1 = getUserForTesting();
      var user2 = getUserForTesting();
      //change user1 so that no duplicate with user2
      user1['email'] += 'a';
      user1['username'] += 'b';
      user1['PPS'] += 'c';
      //the below query will make user2 duplicate with user1
      var updateQueryEmail = {
        email: user1['email']
      };
      var paths = ['/users/createuser', '/users/createuser', '/users/updateuser'];
      var testObjects = [user1, user2, updateQueryEmail];
      var callbacks = [
        function() {},
        function(testObjects, testObject, res) {
            //user2 created
            //reconstruct updatequery, ready for next update requests
          var updateRequestBody = {userId: res.body['userId'], updateQuery: testObjects.shift()};
            //add updatequery back to the testObjects array
          testObjects.unshift(updateRequestBody);
        },
        function(testObjects, testObject, res) {
          //user2's email is requested for updating but should be rejected
          assert.equal(res.body, 'update query cause duplicate');
          done();
        }
      ];
      chaiRequestCreateUser(paths, testObjects, callbacks);
    });
  });

  //update a user with a query that could potentially make him/her duplicate with other user
  describe('/POST users/updateuser', function() {
    it('should avoid updating a user with a username that could potentially make him/her duplicate with other user', function(done) {
      removeAllUsers();
      //First create users
      var user1 = getUserForTesting();
      var user2 = getUserForTesting();
      //change user1 so that no duplicate with user2
      user1['email'] += 'a';
      user1['username'] += 'b';
      user1['PPS'] += 'c';
      //the below query will make user2 duplicate with user1
      var updateQueryUsername = {
        username: user1['username']
      };
      var paths = ['/users/createuser', '/users/createuser', '/users/updateuser'];
      var testObjects = [user1, user2, updateQueryUsername];
      var callbacks = [
        function() {},
        function(testObjects, testObject, res) {
          //user2 created
          //reconstruct updatequery, ready for next update requests
          var updateRequestBody = {userId: res.body['userId'], updateQuery: testObjects.shift()};
          //add updatequery back to the testObjects array
          testObjects.unshift(updateRequestBody);
        },
        function(testObjects, testObject, res) {
          //user2's username is requested for updating but should be rejected
          assert.equal(res.body, 'update query cause duplicate');
          done();
        }
      ];
      chaiRequestCreateUser(paths, testObjects, callbacks);
    });
  });

  //update a user with a query that could potentially make him/her duplicate with other user
  describe('/POST users/updateuser', function() {
    it('should avoid updating a user with an PPS that could potentially make him/her duplicate with other user', function(done) {
      removeAllUsers();
      //First create users
      var user1 = getUserForTesting();
      var user2 = getUserForTesting();
      //change user1 so that no duplicate with user2
      user1['email'] += 'a';
      user1['username'] += 'b';
      user1['PPS'] += 'c';
      //the below query will make user2 duplicate with user1
      var updateQueryPPS = {
        PPS: user1['PPS']
      };
      var paths = ['/users/createuser', '/users/createuser', '/users/updateuser'];
      var testObjects = [user1, user2, updateQueryPPS];
      var callbacks = [
        function() {},
        function(testObjects, testObject, res) {
          //user2 created
          //reconstruct updatequery, ready for next update requests
          var updateRequestBody = {userId: res.body['userId'], updateQuery: testObjects.shift()};
          //add updatequery back to the testObjects array
          testObjects.unshift(updateRequestBody);
        },
        function(testObjects, testObject, res) {
          //user2's PPS is requested for updating but should be rejected
          assert.equal(res.body, 'update query cause duplicate');
          done();
        }
      ];
      chaiRequestCreateUser(paths, testObjects, callbacks);
    });
  });

  //update a user with a query that could potentially make him/her duplicate with other user
  describe('/POST users/updateuser', function() {
    it('should avoid updating a user with email, username, PPS that could potentially make him/her duplicate with other user', function(done) {
      removeAllUsers();
      //First create users
      var user1 = getUserForTesting();
      var user2 = getUserForTesting();
      //change user1 so that no duplicate with user2
      user1['email'] += 'a';
      user1['username'] += 'b';
      user1['PPS'] += 'c';
      //the below query will make user2 duplicate with user1
      var updateQueryAllDupl = {
        email: user1['email'],
        username: user1['username'],
        PPS: user1['PPS']
      };
      var paths = ['/users/createuser', '/users/createuser', '/users/updateuser'];
      var testObjects = [user1, user2, updateQueryAllDupl];
      var callbacks = [
        function() {},
        function(testObjects, testObject, res) {
          //user2 created
          //reconstruct updatequery, ready for next update requests
          var updateRequestBody = {userId: res.body['userId'], updateQuery: testObjects.shift()};
          //add updatequery back to the testObjects array
          testObjects.unshift(updateRequestBody);
        },
        function(testObjects, testObject, res) {
          //user2's email,username,PPS is requested for updating but should be rejected
          assert.equal(res.body, 'update query cause duplicate');
          done();
        }
      ];
      chaiRequestCreateUser(paths, testObjects, callbacks);
    });
  });
});
