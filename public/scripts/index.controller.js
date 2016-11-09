angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('IndexController', IndexController);

  function IndexController(IndexService, $http) {
    var index = this;
    index.isLoggedIn = IndexService;
    index.date = new Date();
    // getUser($http, index);


    IndexService.getUser().then(function(response) {
      console.log('response.data', response);
      index.user = response;
    });

}
