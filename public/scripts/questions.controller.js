angular.module('lojongApp')
.controller('QuestionsController', QuestionsController);

function QuestionsController($http, $location, IndexService) {

  var ctrl = this;
  IndexService.status.login = true;
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
    console.log('response', response.data);
    ctrl.question = response.data
  }, function(error) {
    console.log('error getting questions', error);
  });
}
