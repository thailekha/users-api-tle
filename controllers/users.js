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

/* function noDuplicateUser(newUser,queries,counter) {
  if(queries.length - 1 === counter) {
    //if only 1 item in the queries
    queries[counter].exec(function(err,user) {
      console.log(counter);
      if (err) {
        return res.status(500).json({
          error: "Error reading user: " + err
        });
      }
      //console.log("Length : " + user.length);
      if(user.length !== 0) {
        return res.json({createStatus: "user existed"});
      }
      else {
        newUser.save().then(function(addedUser) {
          console.log("New user created, id: " + addedUser._id + ", id type: " + typeof addedUser._id);
          return res.json({createStatus: "user created" , userId:addedUser._id});
        });
      }
    });
  }
  else {
    queries[counter].exec(function(err,user) {
      console.log(counter);
      if (err) {
        return res.status(500).json({
          error: "Error reading user: " + err
        });
      }
      if(user.length === 0) {
        counter++;
        console.log("Enter next recursion");
        noDuplicateUser(newUser,queries,counter);
        console.log("Out of recursion");
      }
      else {
        console.log("Duplicate user detected");
        return res.json({createStatus: "user existed"});
      }
    });
  }
  console.log("End");
} */

//POST /users/createuser
router.post('/createuser', function(req,res) {
  var newUser = new User(req.body);
  var duplicated = false; 
  
  var noDuplicateAllowed = ["username","email","PPS"];
  for(var i = 0; i < noDuplicateAllowed.length; i++) {  
    var attr = noDuplicateAllowed[i];
    //console.log(attr + "<->" + newUser[attr]);
    //empty find means all rows of instance in db
    noDuplicateAllowed[i] = User.find({}).where(attr).equals(newUser[attr]); //build queries
  }
  
  //check duplicate instances, then create a new user
  noDuplicateAllowed[0].exec(function(err,user) {
    console.log('0');
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }
    if(user.length === 0) {
      noDuplicateAllowed[1].exec(function(err,user) {
        console.log('1');
        if (err) {
          return res.status(500).json({
            error: "Error reading user: " + err
          });
        }
        if(user.length === 0) {
          noDuplicateAllowed[2].exec(function(err,user) {
            console.log('2');
            if (err) {
              return res.status(500).json({
                error: "Error reading user: " + err
              });
            }
            //console.log("Length : " + user.length);
            if(user.length !== 0) {
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
  console.log("Default route hit in /users scope");
  res.json("Default route");
});
module.exports = router;
