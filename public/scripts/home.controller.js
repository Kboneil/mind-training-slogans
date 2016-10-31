angular.module('lojongApp')
.controller('HomeController', HomeController);

function HomeController($http, $location) {
  console.log('HomeController loaded');
  var ctrl = this;
  ctrl.point;
  ctrl.id;
  ctrl.slogan;
  ctrl.extra;
  var id;

    $http.get('/getslogan').then(function(response){
      console.log('response', response.data);
      ctrl.point = response.data.point;
      ctrl.id = "Slogan: " + response.data.id;
      ctrl.slogan = response.data.slogan;
      ctrl.extra = response.data.extra;
      id = response.data.id;
    }, function(error) {
      console.log('error getting slogan', error);
    }).then(function(){
      $http.get('/ques/' + id).then(function(response){
        console.log('response', response.data);
        ctrl.question = response.data
      }, function(error) {
        console.log('error getting slogan comments', error);
      }).then(function(){
      $http.get('/com/' + id).then(function(response){
        console.log('response', response.data);
        ctrl.comment = response.data
      }, function(error) {
        console.log('error getting slogan comments', error);
      });
    });
  });
}
