angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('IndexController', function(IndexService) {
    var index = this;
    index.isLoggedIn = IndexService;
});
