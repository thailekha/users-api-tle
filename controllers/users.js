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
  User.findOne({
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

//POST /users/createutes
router.post('/createuser', function(req,res) {
  var newUser = new User(req.body);  
  newUser.save().then(function(addedUser) {
    /* 
    WHY DOES THIS BLOCK RETURN AN OBJECT OF UNDEFINED ATTRIBUTES ???
    for(var x in addedUser._id) {
      console.log(x + ": ");
      console.log(typeof x === "function" ? addedUser._id.x() : addedUser._id.x);
    } */ 
    console.log("New user created, id: " + addedUser._id + ", id type: " + typeof addedUser._id);
    //console.log(addedUser);
    res.json(addedUser._id);
  });
});

//GET /users/deleteuser/:id
router.get('/deleteuser/:id', function(req,res) {
  console.log("start of delte method");
  User.findOne({
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
    
    console.log("End of delte method");
    res.json("Found user to remove");
  });
});

router.post('/updateuser', function(req,res) {
  //console.log("Users controller: got update request, request id: " + req.body.updateQuery );
  User.findById(req.body.userId, function (err, user){
      if (err) throw err;
      //console.log('Users controller: found user for updating: ' + user);
      var updateQuery = req.body.updateQuery;
      
      //console.log("***********Old user: ");
      //console.log(user);
      for(var attr in updateQuery) {
        user.attr = updateQuery.attr;
      }
      user.save().then(function(updatedUser) {
        //console.log("***********Updated user: ");
        //console.log(updatedUser);
        res.json({updateStatus: "updated user", userId: updatedUser._id});
      });
  });  
});

//Default route
router.get('/*',function(req,res){
  console.log("Default route hit")
  res.json("Default route");
});
module.exports = router;
