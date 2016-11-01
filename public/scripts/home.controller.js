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

ctrl.deleteQuestion = function (question, id) {
  console.log('in deleteQuestion question', question);
  console.log('in deleteQuestion id', id);
}

ctrl.deleteComment = function (question, id) {
  console.log('in deleteComment');
}

ctrl.postQuestion = function (question, slogan){
  var date = new Date();
  var data = {text: question, date: date, slogan_id: slogan}
  console.log('data', data);
  $http.post('/ques', data)
   .then(function (result) {
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
     return result;
   });

}

ctrl.postComment = function (comment, slogan){
  var date = new Date();
  var data = {text: comment, date: date, slogan_id: slogan}
  console.log('data', data);
  $http.post('/com', data)
   .then(function (result) {
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
     return result;
   });

}

}
