angular.module('lojongApp')
.controller('ProfileController', ProfileController);

function ProfileController($http, $location) {
  var ctrl = this;
  getUser($http, ctrl);

ctrl.logout = function (){
  $http.get('/users/logout').then(function(response){
    console.log('response', response.data);
  }, function(error) {
    console.log('error getting user to logout', error);
  }).then(function(){
    $location.path('/login');
  }, function(error) {
    console.log('error logging out', error);
  });
}
}

function getUser ($http, ctrl) {
  $http.get('/users').then(function(response){
    console.log('response', response.data);
    ctrl.user = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
