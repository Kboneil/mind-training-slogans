const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const pool = require('../db/connection');
var id;
//find by username
function findByUsername(username) {

  return new Promise(function (resolve, reject){
    pool.connect(function (err, client, done) {
      if (err) {
        done();
        return reject(err);
      }

      client.query('SELECT * FROM users WHERE username=$1', [username], function (err, result) {
        done();
        if (err) {
          return reject(err);
        }
        resolve(result.rows[0]);
      });
    });
  });

}
//find by id
function findById(id) {
  id = id;
  console.log('findById', id);
  return new Promise(function (resolve, reject){
    pool.connect(function (err, client, done) {
      if (err) {
        done();
        return reject(err);
      }

      client.query('SELECT * FROM users WHERE id=$1', [id], function (err, result) {
        done();
        if (err) {
          return reject(err);
        }
        resolve(result.rows[0]);
      });

    });
  });

}
//create
function create(username, password) {
  return new Promise(function (resolve, reject){

    bcrypt.hash(password, SALT_ROUNDS, function(err, hash){
      if (err) {
        console.log('Error hashing password', err);
        return reject(err);
      }


      pool.connect(function (err, client, done) {
        if (err) {
          done();
          return reject(err);
        }

        client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hash], function (err, result) {
          done();
          if (err) {
            return reject(err);
          }
          console.log('result of create', result.data);
            return resolve(result.rows[0]);
        });


      });
    });
  });
}

//find and compare password
function comparePassword(user, passwordToCompare) {
    return new Promise(function(resolve){
      bcrypt.compare(passwordToCompare, user.password, function(err, match){
        if (err) {
          console.log('Error comparing password', err);
          return resolve(false);
        }
        resolve(match);
      });
    });
}

console.log('id in exports', id);

module.exports = {
  findByUsername: findByUsername,
  findById: findById,
  create: create,
  comparePassword: comparePassword,
  user_id: id
};
