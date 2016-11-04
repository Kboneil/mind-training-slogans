angular.module('lojongApp')
.controller('HomeController', HomeController);

function HomeController($http, $location, IndexService) {

  var ctrl = this;
  IndexService.status.login = true;
  getUser($http, ctrl);
  ctrl.point;
  ctrl.id;
  ctrl.slogan;
  ctrl.extra;
  var id;
  ctrl.date = new Date();
  loadSlogans($http, ctrl);



ctrl.postQuestion = function (question, slogan){
  var date = new Date();
  var data = {question: question, date: date, slogan_id: slogan}
  $http.post('/ques', data)
   .then(function (response) {
     getSlogansCommentsQuestions($http, ctrl);
     ctrl.newQuestion = '';
   });

}

ctrl.postComment = function (comment, slogan){
  var date = new Date();
  var data = {comment: comment, date: date, slogan_id: slogan}
  $http.post('/com', data)
   .then(function (response) {
      getSlogansCommentsQuestions($http, ctrl);
      ctrl.newComment = '';
   });
}

ctrl.changeComment = function (comment, id){
  var id = id;
  var data = {comment: comment, id: id}
  $http.put('/com/' + id, data)
   .then(function (response) {
      getSlogansCommentsQuestions($http, ctrl);
   });
}

ctrl.changeQuestion = function (question, id){
  var id = id;
  var data = {question: question, id: id}
  $http.put('/ques/' + id, data)
   .then(function (response) {
      getSlogansCommentsQuestions($http, ctrl);
   });
}


ctrl.deleteComment = function (id){
  $http.delete('/com/' + id)
    .then(function (response) {
      console.log('delete complete');
    }).then(function (response) {
    getSlogansCommentsQuestions($http, ctrl);
  });
}

ctrl.deleteQuestion = function (id){
  $http.delete('/ques/' + id)
    .then(function (response) {
      console.log('delete complete');
    }).then(function (response) {
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
  }, function(error) {
    console.log('error getting slogan', error);
  }).then(function(){
    $http.get('/ques/' + id).then(function(response){
      console.log('response', response.data);
      ctrl.question = response.data
    }, function(error) {
      console.log('error getting slogan comments', error);
    }).then(function(){
    $http.get('/com/' + id).then(function(response){
      console.log('response', response.data);
      ctrl.comment = response.data
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
  }, function(error) {
    console.log('error getting slogan', error);
  }).then(function(){
    //gets all the questions from this user for the slogan of the day
    $http.get('/ques/' + id).then(function(response){
      console.log('response questions', response.data);
      ctrl.question = response.data
    }, function(error) {
      console.log('error getting slogan questions', error);
    }).then(function(){
    //gets all the comments from this user for the slogan of the day
    $http.get('/com/' + id).then(function(response){
      console.log('response comments', response.data);
      ctrl.comment = response.data
    }, function(error) {
      console.log('error getting slogan comments', error);
    });
    });
  });


}
function getUser ($http, ctrl) {
  $http.get('/users').then(function(response){
    console.log('response getUser', response.data);
    ctrl.user = response.data
  }, function(error) {
    console.log('error getting user', error);
  });
}
