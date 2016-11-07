angular.module('lojongApp')
.controller('HomeController', HomeController);

function HomeController($http, $location, IndexService, qcService) {

  var ctrl = this;
  IndexService.status.login = true;
  ctrl.point;
  ctrl.id;
  ctrl.slogan;
  ctrl.extra;
  var id;
  ctrl.date = new Date();
  loadSlogans($http, ctrl);


  ctrl.postQuestion = function(question, slogan){
    qcService.postQuestion(question, slogan).then(function(){
      getSlogansCommentsQuestions($http, ctrl);
      ctrl.newQuestion = '';
    });
  }

  ctrl.postComment = function(comment, slogan){
    qcService.postComment(comment, slogan).then(function(){
      getSlogansCommentsQuestions($http, ctrl);
      ctrl.newComment = '';
    });
  }

  ctrl.deleteQuestion = function(id){
    qcService.deleteQuestion(id).then(function(){
      getSlogansCommentsQuestions($http, ctrl);
    });
  }

  ctrl.deleteComment = function(id){
    qcService.deleteComment(id).then(function(){
      getSlogansCommentsQuestions($http, ctrl);
    });
  }


  ctrl.changeQuestion = function(question, id){
    qcService.changeQuestion(question, id).then(function(){
      getSlogansCommentsQuestions($http, ctrl);
    });
  }

  ctrl.changeComment = function(comment, id){
    qcService.changeComment(comment, id).then(function(){
      getSlogansCommentsQuestions($http, ctrl);
    });
  }




}//end of controller

function getSlogansCommentsQuestions($http, ctrl) {
  $http.get('/getslogan').then(function(response){
    var user = response.data[0];
    ctrl.point = user.point;
    ctrl.id = user.daily;
    ctrl.slogan = user.slogan;
    ctrl.extra = user.extra;
    ctrl.question = [];
    ctrl.comment = [];
  }, function(error) {
    console.log('error getting slogan', error);
  }).then(function(){
    $http.get('/ques/' + id).then(function(response){
      if (!response.data[0]) {
        ctrl.question.push({question: 'no questions yet'});
      } else {
      ctrl.question = response.data
    }
    }, function(error) {
      console.log('error getting slogan comments', error);
    }).then(function(){
    $http.get('/com/' + id).then(function(response){
      console.log('response', response.data);
      if (!response.data[0]) {
        ctrl.comment.push({comment: 'no comments yet'});;
      } else {
      ctrl.comment = response.data
    }
    }, function(error) {
      console.log('error getting slogan comments', error);
    });
  });
});
}
function loadSlogans ($http, ctrl) {
  //gets the slogan of the day

  $http.get('/getslogan').then(function(response){
    var user = response.data[0];
    ctrl.point = user.point;
    ctrl.id = user.daily;
    ctrl.slogan = user.slogan;
    ctrl.extra = user.extra;
    id = user.daily
    ctrl.question = [];
    ctrl.comment = [];
  }, function(error) {
    console.log('error getting slogan', error);
  }).then(function(){
    //gets all the questions from this user for the slogan of the day
    $http.get('/ques/' + id).then(function(response){
      if (!response.data[0]) {
        ctrl.question.push({question: 'no questions yet'});
      } else {
      ctrl.question = response.data
    }
    }, function(error) {
      console.log('error getting slogan questions', error);
    }).then(function(){
    //gets all the comments from this user for the slogan of the day
    $http.get('/com/' + id).then(function(response){
      if (!response.data[0]) {
        ctrl.comment.push({comment: 'no comments yet'});;
      } else {
      ctrl.comment = response.data
    }
    }, function(error) {
      console.log('error getting slogan comments', error);
    });
    });
  });

}
