angular.module('lojongApp')
.controller('CommentsController', CommentsController);

function CommentsController($http, $location) {
  console.log('CommentsController loaded');
  var ctrl = this;
  getUser($http, ctrl);
  getComments($http, ctrl);

    ctrl.deleteComment = function (id){
      $http.delete('/com/' + id)
        .then(function (response) {
          console.log('delete complete');
        }).then(function (response) {
          getComments($http, ctrl);
        });

    }

    // ctrl.postComment = function (comment, slogan){
    //   console.log('id', slogan);
    //   var date = new Date();
    //   var data = {comment: comment, date: date, slogan_id: slogan}
    //   $http.post('/com', data)
    //    .then(function (response) {
    //      console.log('success');
    //       getComments($http, ctrl);
    //       ctrl.newComment = '';
    //    });
    // }

    ctrl.changeComment = function (comment, id){
      var id = id;
      var data = {comment: comment, id: id}
      $http.put('/com/' + id, data)
       .then(function (response) {
          getComments($http, ctrl);
       });
    }
}//end of controller


function getComments($http, ctrl) {
  $http.get('/com').then(function(response){
    console.log('data', response.data);
    ctrl.comment = response.data
  }, function(error) {
    console.log('error getting comments', error);
  });
}
function getUser ($http, ctrl) {
  $http.get('/users').then(function(response){
    console.log('response', response.data);
    ctrl.user = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
