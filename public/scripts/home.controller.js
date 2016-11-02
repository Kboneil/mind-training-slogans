angular.module('lojongApp')
.controller('HomeController', HomeController);

function HomeController($http, $location) {
  console.log('HomeController loaded');
  var ctrl = this;
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
   .then(function (result) {
     getSlogansCommentsQuestions($http, ctrl);
     return result;
   });

}

ctrl.postComment = function (comment, slogan){
  var date = new Date();
  var data = {comment: comment, date: date, slogan_id: slogan}
  $http.post('/com', data)
   .then(function (result) {
      getSlogansCommentsQuestions($http, ctrl);
     return result;
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
    console.log('response', response.data);
    ctrl.point = response.data.point;
    ctrl.id = response.data.id;
    ctrl.slogan = response.data.slogan;
    ctrl.extra = response.data.extra;
    id = response.data.id;
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
    console.log('response slogans', response.data);
    ctrl.point = response.data.point;
    ctrl.id = response.data.id;
    ctrl.slogan = response.data.slogan;
    ctrl.extra = response.data.extra;
    id = response.data.id;
  }, function(error) {
    console.log('error getting slogan', error);
  }).then(function(){
    //gets all the questions from this user for the slogan of the day
    $http.get('/ques/' + id).then(function(response){
      console.log('response questions', response.data);
      ctrl.question = response.data
    }, function(error) {
      console.log('error getting slogan comments', error);
    }).then(function(){
    //gets all the comments from this user for the slogan of the day
    $http.get('/com/' + id).then(function(response){
      console.log('response comments', response.data);
      ctrl.comment = response.data
    }, function(error) {
      console.log('error getting slogan comments', error);
    }).then(function(){
      //sends the date that this slogan was practiced by this user to the DB
      var data = {date: ctrl.date, slogan_id: id}
      $http.post('/date', data).then(function(response){
        console.log('response post', response.data);
    }, function(error) {
      console.log('error getting slogan comments', error);
    });
  });
});
  });
}
