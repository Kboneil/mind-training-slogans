angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('IndexController', function(IndexService, $http) {
    var index = this;
    index.isLoggedIn = IndexService;
    index.date = new Date();
    getUser($http, index);
});

function getUser ($http, index) {
  $http.get('/users').then(function(response){
    console.log('response', response.data);
    index.user = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
