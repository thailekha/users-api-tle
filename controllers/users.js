var User = require('../models/user');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

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

router.get('/deleteall/', function(req, res) {
  console.log('******************************************************88');
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  }); 
});

//GET /users/username/:username
router.get('/username/:username', function(req,res) {
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
});

//POST /users/createuser
router.post('/createuser', function(req,res) {
  var newUser = new User(req.body);
  var duplicated = false;
  
  //check duplicate instances
  var noDuplicateAllowed = ["username","email","pps"];
  for(var i = 0; i < noDuplicateAllowed.length; i++) {  
    var attr = noDuplicateAllowed[i];
    
    //empty find means all rows of instance in db
    noDuplicateAllowed[i] = User.find({}).where(attr).equals(newUser[attr]); //build queries
    //exec(callback);
  }
  
  //var counter = 0;
  noDuplicateAllowed[0].exec(function(err,user) {
    console.log('0');
    console.log(err);
    //console.log(user);
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }
    if(!user) {
      noDuplicateAllowed[1].exec(function(err,user) {
        console.log('1');
        if (err) {
          return res.status(500).json({
            error: "Error reading user: " + err
          });
        }
        if(!user) {
          noDuplicateAllowed[2].exec(function(err,user) {
            console.log('2');
            if (err) {
              return res.status(500).json({
                error: "Error reading user: " + err
              });
            }
            if(user) {
              res.json({createStatus: "user existed"});
            }
            else {
              newUser.save().then(function(addedUser) {
                console.log("New user created, id: " + addedUser._id + ", id type: " + typeof addedUser._id);
                res.json({createStatus: "user created" , userId:addedUser._id});
              });
            }
          });
        }
        else {
          res.json({createStatus: "user existed"});
        }
      });
    }
    else {
      console.log("Duplicate user detected");
      res.json({createStatus: "user existed"});
    }
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
    res.json('user deleted');
  });
});

//POST /users/updateuser
router.post('/updateuser', function(req,res) {
  User.where({ _id: req.body.userId })
  .update(req.body.updateQuery, function(err,updatedUser) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }
    res.json(updatedUser);
  });
});

//Default route
router.get('/*',function(req,res){
  console.log("Default route hit");
  res.json("Default route");
});
module.exports = router;
