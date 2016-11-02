angular.module('lojongApp')
.controller('ProfileController', ProfileController);

function ProfileController($http, $location) {
  var ctrl = this;
  getUser($http, ctrl);
}

function getUser ($http, ctrl) {
  $http.get('/users').then(function(response){
    console.log('response', response.data);
    ctrl.user = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
