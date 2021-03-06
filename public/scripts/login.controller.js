angular.module('lojongApp')
.controller('LoginController', LoginController);

function LoginController($http, $location) {
  console.log('LoginController loaded');
  var ctrl = this;

  ctrl.login = function() {
    $http.post('/login', {
      username: ctrl.username,
      password: ctrl.password
    }).then(function(){
      $location.path('/home');
    }, function(error) {
      console.log('error loggin in', error);
      alert('Sorry! Your username and password was not accepted. Please try again');
    });
  };

}
