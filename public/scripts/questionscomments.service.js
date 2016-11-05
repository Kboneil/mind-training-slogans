angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .service('qcService', qcService);

  function qcService($http) {

    this.postQuestion = function (question, slogan){
      var date = new Date();
      var data = {question: question, date: date, slogan_id: slogan}
       return $http.post('/ques', data)
       .then(function (response) {
         console.log('post question success');
       });
    }

    this.postComment = function (comment, slogan){
      var date = new Date();
      var data = {comment: comment, date: date, slogan_id: slogan}
       return $http.post('/com', data)
       .then(function (response) {
         console.log('post comment success');
       });
    }

    this.changeQuestion = function (question, id){
      var id = id;
      var data = {question: question, id: id}
       return $http.put('/ques/' + id, data)
       .then(function (response) {
         console.log('change question success');
       });
    }

    this.changeComment = function (comment, id){
      var id = id;
      var data = {comment: comment, id: id}
       return $http.put('/com/' + id, data)
       .then(function (response) {
         console.log('change comment success');
       });
    }

    this.deleteQuestion = function (id){
      return $http.delete('/ques/' + id)
        .then(function (response) {
          console.log('delete complete');
        });
    }

    this.deleteComment = function (id){
      return $http.delete('/com/' + id)
        .then(function (response) {
          console.log('delete complete');
        });
    }

  }
