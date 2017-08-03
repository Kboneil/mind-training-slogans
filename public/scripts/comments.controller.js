angular.module('lojongApp')
.controller('CommentsController', CommentsController);

function CommentsController($http, $location, IndexService, qcService) {
  var ctrl = this;
  ctrl.date = new Date();

  IndexService.getUser().then(function(response) {
    ctrl.user = response;
  });
  getComments($http, ctrl);

  ctrl.deleteComment = function(id){
    qcService.deleteComment(id).then(function(){
      getComments($http, ctrl);
    });
  }
  ctrl.changeComment = function(comment, id){
    qcService.changeComment(comment, id).then(function(){
      getComments($http, ctrl);
    });
  }

}//end of controller


function getComments($http, ctrl) {
  $http.get('/com').then(function(response){
    ctrl.comment = response.data
  }, function(error) {
    console.log('error getting comments', error);
  });
}
