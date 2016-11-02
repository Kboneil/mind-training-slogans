angular.module('lojongApp')
.controller('SlogansController', SlogansController);

function SlogansController($http, $location) {
  console.log('SlogansController loaded');
  var ctrl = this;
  ctrl.slogans = [];

    $http.get('/sloganlist').then(function(response){
      console.log('response slogans', response.data);
      // ctrl.slogans = response.data;

      response.data.forEach(function(slogan){

        ctrl.comments = ''
        console.log('foreach', slogan.id);
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
          console.log('question response', response.data);
            response.data.forEach(function(question){
            slogan.questions.push({question: question.question, date: question.date, id: question.id});
            });

        }, function(error) {
          console.log('error getting slogan comments', error);
        });//endGEt
        ctrl.slogans.push({slogan: slogan.slogan, id: slogan.id, point: slogan.point, extra: slogan.extra, comments: slogan.comments, questions: slogan.questions})
        console.log("???", ctrl.slogans);
      });//end forEach


    }, function(error) {
      console.log('error getting slogans', error);
    });




}
