angular.module('lojongApp')
.controller('NewUserController', NewUserController);

function NewUserController($http, $location) {
  var ctrl = this;
  getUser($http, ctrl);

  ctrl.sendUserInfo = function (name, frequency, order){
    var data = {name:name, frequency: frequency, random: order};
      console.log(data);
    $http.put('/users', data).then(function(response){
      console.log('response post', response.data);
    }, function(error) {
      console.log('error posting order answer', error);
    });
    document.getElementById('hideForm').style.display = 'none';
    document.getElementById('showButton').style.display = 'inherit';
  };

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
  };



}//end of controller

function getUser ($http, ctrl) {
  $http.get('/users').then(function(response){
    console.log('response', response.data);
    ctrl.user = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
