// CHO 5-8: fs module — file handling
const fs   = require('fs');
const path = require('path');

// Path to our data file
const USER_FILE = path.join(__dirname, '..', 'user.json');

// READ all users from file
function readUsers(callback) {
  fs.readFile(USER_FILE, 'utf8', function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') return callback(null, []);
      return callback(err, null);
    }
    try {
      callback(null, JSON.parse(data));
    } catch(e) {
      callback(e, null);
    }
  });
}

// WRITE users back to file
function writeUsers(users, callback) {
  const json = JSON.stringify(users, null, 2);
  fs.writeFile(USER_FILE, json, 'utf8', function(err) {
    callback(err);
  });
}

// CHO 17-20: module.exports — share functions with other files
module.exports = { readUsers, writeUsers };