angular.module('lojongApp')
.controller('ProfileController', ProfileController);

function ProfileController($http, $location, IndexService) {
  var ctrl = this;

  IndexService.status.login = true;
  // getUser($http, ctrl);

ctrl.sendUserInfo = function (name, messages, time, number, order){
  var data = {name:name, messages: messages, time: time, number: number, random: order};
  ctrl.name = '';
  ctrl.messages = '';
  ctrl.order = '';
  ctrl.time = '';
  ctrl.number = '';
    console.log(data);
  $http.put('/users/returning', data).then(function(response){
    console.log('response post', response.data);
}, function(error) {
  console.log('error posting order answer', error);
});
}


IndexService.getUser().then(function(response) {
  console.log('response');
});



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
