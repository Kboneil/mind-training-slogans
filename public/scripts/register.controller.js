angular.module('lojongApp')
.controller('RegisterController', RegisterController);

function RegisterController($http, $location) {
  console.log('RegisterController loaded');
  var ctrl = this;

  ctrl.register = function() {
    console.log('registering new user');
    $http.post('/register', {
      username: ctrl.username,
      password: ctrl.password
    }).then(function(){
      $location.path('/newuser');
    }, function(error) {
      alert('That username is already taken.');
      console.log('error registering', error);
    });
  };
}
