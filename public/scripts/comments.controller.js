angular.module('lojongApp')
.controller('CommentsController', CommentsController);

function CommentsController($http, $location) {
  console.log('CommentsController loaded');
  var ctrl = this;

    $http.get('/com').then(function(response){
      ctrl.comment = response.data
    }, function(error) {
      console.log('error getting comments', error);
    });

    ctrl.deleteComment = function (id){
      $http.delete('/com/' + id)
        .then(function (response) {
          console.log('delete complete');
        });
        $http.get('/com').then(function(response){
          ctrl.comment = response.data
        }, function(error) {
          console.log('error getting comments', error);
        });
    }
}
