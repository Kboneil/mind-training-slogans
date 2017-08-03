angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .service('IndexService', IndexService);

  function IndexService($http) {

    this.getUser = function () {
      return $http.get('/users').then(function(response){
        return response.data;
      }, function(error) {
        console.log('error getting questions', error);
      });
    };


  }
