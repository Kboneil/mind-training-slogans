// routing
angular.module('lojongApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'HomeController as home'
  }).when('/register', {
    templateUrl: 'views/register.html',
    controller: 'RegisterController as register'
  }).when('/calendar', {
    templateUrl: 'views/calendar.html',
    controller: 'calendarCtrl as vm'
  }).when('/profile', {
    templateUrl: 'views/profile.html',
    controller: 'ProfileController as profile'
  }).when('/comments', {
    templateUrl: 'views/comments.html',
    controller: 'CommentsController as comments'
  }).when('/questions', {
    templateUrl: 'views/questions.html',
    controller: 'QuestionsController as questions'
  }).when('/slogans', {
    templateUrl: 'views/slogans.html',
    controller: 'SlogansController as slogans'
  }).when('/newuser', {
    templateUrl: 'newuser/slogans.html',
    controller: 'NewUserController as new'
  }).otherwise({
    templateUrl: 'views/login.html',
    controller: 'LoginController as login'
  });
});
