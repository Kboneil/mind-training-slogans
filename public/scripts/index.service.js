angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .service('IndexService', IndexService);

  function IndexService() {
    var status = {
      login: false,
    };
    return {status: status};
  }
