angular.module('lojongApp')
.controller('SlogansController', SlogansController);

function SlogansController($http, $location, IndexService, qcService) {

  var ctrl = this;
  IndexService.status.login = true;
  ctrl.slogans = [];

  getAllSlogans($http, ctrl);

    ctrl.postQuestion = function(question, slogan){
      qcService.postQuestion(question, slogan).then(function(){
        getAllSlogans($http, ctrl);
        ctrl.newQuestion = '';
      });
    }

    ctrl.postComment = function(comment, slogan){
      qcService.postComment(comment, slogan).then(function(){
        getAllSlogans($http, ctrl);
        ctrl.newComment = '';
      });
    }

    ctrl.deleteQuestion = function(id){
      qcService.deleteQuestion(id).then(function(){
        getAllSlogans($http, ctrl);
      });
    }

    ctrl.deleteComment = function(id){
      qcService.deleteComment(id).then(function(){
        getAllSlogans($http, ctrl);
      });
    }

    ctrl.changeQuestion = function(question, id){
      qcService.changeQuestion(question, id).then(function(){
        getAllSlogans($http, ctrl);
      });
    }

    ctrl.changeComment = function(comment, id){
      qcService.changeComment(comment, id).then(function(){
        getAllSlogans($http, ctrl);
      });
    }


}

function getAllSlogans ($http, ctrl) {
  ctrl.slogans = [];
  $http.get('/sloganlist').then(function(response){

    response.data.forEach(function(slogan){
      var id = slogan.id;
      slogan.comments = [];
      slogan.questions = [];

      $http.get('/com/' + id).then(function(response){
          response.data.forEach(function(comment){
            slogan.comments.push({comment: comment.comment, date: comment.date, id: comment.id});
          });
      }, function(error) {
        console.log('error getting slogan comments', error);
      });//endGEt

      $http.get('/ques/' + id).then(function(response){
          response.data.forEach(function(question){
          slogan.questions.push({question: question.question, date: question.date, id: question.id});
          });

      }, function(error) {
        console.log('error getting slogan comments', error);
      });//endGEt
      ctrl.slogans.push({slogan: slogan.slogan, id: slogan.id, point: slogan.point, extra: slogan.extra, comments: slogan.comments, questions: slogan.questions})
    });//end forEach

  }, function(error) {
    console.log('error getting slogans', error);
  });

}
