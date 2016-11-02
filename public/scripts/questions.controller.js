angular.module('lojongApp')
.controller('QuestionsController', QuestionsController);

function QuestionsController($http, $location) {
  console.log('QuestionsController loaded');
  var ctrl = this;
  getQuestions($http, ctrl);


    ctrl.deleteQuestion = function (id){
      $http.delete('/ques/' + id)
        .then(function (response) {
          console.log('delete complete');
        });
        $http.get('/ques').then(function(response){
          ctrl.question = response.data
        }, function(error) {
          console.log('error getting questions', error);
        });
    }

    ctrl.changeQuestion = function (question, id){
      var id = id;
      var data = {question: question, id: id}
      $http.put('/ques/' + id, data)
       .then(function (response) {
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
