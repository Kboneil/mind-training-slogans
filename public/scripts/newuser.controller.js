angular.module('lojongApp')
.controller('NewUserController', NewUserController);

function NewUserController($http, $location, IndexService) {
  var ctrl = this;

  IndexService.getUser().then(function(response) {
    console.log('response.data', response);
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
      console.log(data);
    $http.put('/users', data).then(function(response){
      console.log('response post', response.data);
  }, function(error) {
    alert('Sorry! There was an error. Please try again.')
    console.log('error posting order answer', error);
  }).then(function(){
    IndexService.getUser().then(function(response) {
      console.log('response.data', response);
      ctrl.user = response;
    });
    document.getElementById('hideForm').style.display = 'none';
    document.getElementById('showButton').style.display = 'inherit';
  });
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

ctrl.selectSMS = function (selection){
  if (selection === 'true'){
    document.getElementById('SMS').style.display = 'inherit';
  } else {
    document.getElementById('SMS').style.display = 'none';
  }
}

}//end of controller
