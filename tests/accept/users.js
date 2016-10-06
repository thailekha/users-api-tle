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
            expect(res.body).to.be.a('object');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });
    });
  });
  
  describe('/POST users/createuser', function() {
    it('should create a new user', function(done) {
      var userForTesting = {
          gender: "female",
          name: {
            title: "mi",
            first: "alis",
            last: "re"
          },
          location: {
            street: "1097 the aven",
            city: "Newbrid",
            state: "oh",
            zip: "287"
          },
          email: "alison.reid@example.c",
          username: "tinywolf7",
          password: "rock",
          salt: "lypI10",
          md5: "bbdd6140e188e3bf68ae7ae67345df",
          sha1: "4572d25c99aa65bbf0368168f65d9770b7cacf",
          sha256: "ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4",
          registered: "12371768",
          dob: "9328719",
          phone: "031-541-91",
          cell: "081-647-46",
          PPS: "330224",
          picture: {
            large: "https://randomuser.me/api/portraits/women/60.j",
            medium: "https://randomuser.me/api/portraits/med/women/60.j",
            thumbnail: "https://randomuser.me/api/portraits/thumb/women/60.j"
          }
      }
      
      chai.request(url)
      .post('/users/createuser')
      .set('content-type', 'application/json')
      .send(userForTesting)
      .end(function(error, response, body) {
          if (error) {
              done(error);
          } else {
              assert.isOk(typeof res.body === 'number');
              User.findById(res.body, function (err, user){
                  if (err) throw err;

                  // show the one user
                  console.log(user);
                  assert.deepEqual(userForTesting,user);
                  done();
              });
          }
      });
        
    });
  });
});
