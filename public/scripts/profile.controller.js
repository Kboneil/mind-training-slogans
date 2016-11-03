angular.module('lojongApp')
.controller('ProfileController', ProfileController);

function ProfileController($http, $location) {
  var ctrl = this;
  getUser($http, ctrl);

ctrl.changeOrder = function (answer){
  console.log(answer);
  var data = {random: answer};
  $http.put('/users', data).then(function(response){
    console.log('response post', response.data);
}, function(error) {
  console.log('error posting order answer', error);
});
}




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




}//end of controller

function getUser ($http, ctrl) {
  $http.get('/users').then(function(response){
    console.log('response', response.data);
    ctrl.user = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
