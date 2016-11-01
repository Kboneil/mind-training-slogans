angular.module('lojongApp')
.controller('SlogansController', SlogansController);

function SlogansController($http, $location) {
  console.log('SlogansController loaded');
  var ctrl = this;
  ctrl.slogans;

    $http.get('/date').then(function(response){
      console.log('response slogans', response.data);
      ctrl.slogans = response.data;
    }, function(error) {
      console.log('error getting slogans', error);
    });

}
