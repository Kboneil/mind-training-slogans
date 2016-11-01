angular.module('lojongApp')
.controller('SlogansController', SlogansController);

function SlogansController($http, $location) {
  console.log('SlogansController loaded');
  var ctrl = this;
  ctrl.slogans;

    $http.get('/sloganlist').then(function(response){
      console.log('response slogans', response.data);
      ctrl.slogans = response.data;
    }, function(error) {
      console.log('error getting slogans', error);
    });

    ctrl.getComments = function(id) {
      console.log('inside getComment id', id);
      var id = id;
      $http.get('/com/' + id).then(function(response){
        console.log('response', response.data);
        if(!response.data) {
          ctrl.comments = 'No comments';
        } else {
          ctrl.comments = response.data;
        }

      }, function(error) {
        console.log('error getting slogan comments', error);
      })
    }

    ctrl.getQuestions = function(id) {
      console.log('inside getQuestion id', id);
      var id = id;
      $http.get('/ques/' + id).then(function(response){
        console.log('response', response.data);
        if(!response.data) {
          ctrl.questions = 'No questions';
        } else {
          ctrl.questions = response.data;
        }
      }, function(error) {
        console.log('error getting slogan quesetions', error);
      })
    }



}
