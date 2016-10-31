angular.module('lojongApp')
.controller('CommentsController', CommentsController);

function CommentsController($http, $location) {
  console.log('CommentsController loaded');
  var ctrl = this;

    $http.get('/com').then(function(response){
      console.log('response', response.data);
      ctrl.comment = response.data
    }, function(error) {
      console.log('error getting comments', error);
    });


}
