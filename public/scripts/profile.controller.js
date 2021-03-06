angular.module('lojongApp')
.controller('ProfileController', ProfileController);

function ProfileController($http, $location, IndexService) {
  var ctrl = this;
  ctrl.date = new Date();

  IndexService.getUser().then(function(response) {
    ctrl.user = response;
  });
ctrl.sendUserInfo = function (name, messages, time, number, order){
  if (time === ''){
    time = null;
  }
  if (number === ''){
    number = null;
  }
  if (name.length > 15){
    alert('Please enter a name that is fewer than 15 characters');
    return;
  }
  if (name.length === 0){
    alert('Please enter a name');
    return;
  }
  var data = {name:name, messages: messages, time: time, number: number, random: order};
  ctrl.name = '';
  ctrl.messages = '';
  ctrl.order = '';
  ctrl.time = '';
  ctrl.number = '';
  $http.put('/users/returning', data).then(function(response){
}, function(error) {
  alert('Sorry! There was an error. Please try again.')
  console.log('error posting order answer', error);
});
}


IndexService.getUser().then(function(response) {
  ctrl.user = response;
});


ctrl.selectSMS = function (selection){
  if (selection === 'true'){
    document.getElementById('SMS').style.display = 'inherit';
  } else {
    document.getElementById('SMS').style.display = 'none';
  }
}


ctrl.logout = function (){
  $http.get('/users/logout').then(function(response){
  }, function(error) {
    console.log('error getting user to logout', error);
  }).then(function(){
    $location.path('/');
  }, function(error) {
    console.log('error logging out', error);
  });
}



}//end of controller
