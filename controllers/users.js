var User = require('../models/user');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Promise = require('bluebird');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

// GET /users
// Get a list of users
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  }); 
});

// GET /users/:id
// Get a user by ID
router.get('/:id', function(req, res) {
  User.find({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});

//handle an array of Mongoose finding-user-queries
function execDbQueries(dbQueries, req, res, callback, errorCallback) {
  if(dbQueries.length === 0)
    //if no query to execute
    callback(req,res);
  else {
    dbQueries.shift().exec().then(function(results) {
      if(results.length === 0) {
        execDbQueries(dbQueries, req, res, callback, errorCallback);
      }
      else
        errorCallback(res);
    });
  }
}

//check for duplicate user or update query that can potentially cause duplicate users
//req and res are original request and response from client, these are passed to the callback
function checkNoDuplicateUser(query, req, res, callback, errorCallback) {
  var noDuplicateAllowed = ["username","email","PPS"];
  var mongooseFindQueries = []
  for(var i = 0; i < noDuplicateAllowed.length; i++) {  
    var attr = noDuplicateAllowed[i];
    
    //empty find{} means get all rows of instance in db
    if(query[attr] !== undefined)
      mongooseFindQueries.push(User.find({}).where(attr).equals(query[attr])); //build find queries
  }
  execDbQueries(mongooseFindQueries,req,res,callback,errorCallback);
}

//POST /users/createuser
router.post('/createuser', function(req,res) {
  var newUser = new User(req.body);
  checkNoDuplicateUser(newUser,req, res, function(req,res) {
    return newUser.save().then(function(addedUser) {
      console.log("New user created, id: " + addedUser._id + ", id type: " + typeof addedUser._id);
      res.json({createStatus: "user created" , userId:addedUser._id});
    });
  }, function(res) {
    console.log("Duplicate user detected");
    res.json({createStatus: "user existed"});
  });
});

//GET /users/deleteuser/:id
router.get('/deleteuser/:id', function(req,res) {  
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }
    res.status(200).json('user deleted');
  });
});

//POST /users/updateuser
router.post('/updateuser', function(req,res) {
  checkNoDuplicateUser(req.body.updateQuery, req, res, function(req,res) {
    User.where({ _id: req.body.userId })
    .update(req.body.updateQuery, function(err,updatedUser) {
      if (err) {
        return res.status(500).json({
          error: "Error reading user: " + err
        });
      }
      res.status(200).json(updatedUser);
    });
  }, function(res) {
    res.json('update query cause duplicate');
  });
});

//GET /users/username/:username (for testing)
/* router.get('/username/:username', function(req,res) {
  User.find({
    username: req.params.username
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
}); */

//Default route (for testing)
/* router.get('/*',function(req,res){
  console.log("Default route hit in /users scope");
  res.json("Default route");
}); */

module.exports = router;
