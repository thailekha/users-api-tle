var User = require('../models/user');
var express = require('express');
var router = express.Router();

//GET /deleteall
router.get('/', function(req,res) {
/*   User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  });  */
  
  console.log("REMOVING");
  User.remove({}, function(err, users) {
    console.log("REMOVED");
    cosnole.log(users);
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }
    res.json(users);
  });
});