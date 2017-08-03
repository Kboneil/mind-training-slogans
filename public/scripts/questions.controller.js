angular.module('lojongApp')
.controller('QuestionsController', QuestionsController);

function QuestionsController($http, $location, IndexService, qcService) {

  var ctrl = this;
  ctrl.date = new Date();

  IndexService.getUser().then(function(response) {
    ctrl.user = response;
  });
  getQuestions($http, ctrl);


  ctrl.deleteQuestion = function(id){
    qcService.deleteQuestion(id).then(function(){
      getQuestions($http, ctrl);
    });
  }

  ctrl.changeQuestion = function(question, id){
    qcService.changeQuestion(question, id).then(function(){
    getQuestions($http, ctrl);
    });
  }


}//end of controller

function getQuestions($http, ctrl) {
  $http.get('/ques').then(function(response){
    ctrl.question = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
