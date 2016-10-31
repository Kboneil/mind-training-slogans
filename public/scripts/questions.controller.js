angular.module('lojongApp')
.controller('QuestionsController', QuestionsController);

function QuestionsController($http, $location) {
  console.log('QuestionsController loaded');
  var ctrl = this;

    $http.get('/ques').then(function(response){
      console.log('response', response.data);
      ctrl.question = response.data
    }, function(error) {
      console.log('error getting questions', error);
    });


}
