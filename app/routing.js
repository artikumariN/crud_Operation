var app  =  angular.module('myApp',['ui.router']);
app.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('/', {
      url: "/",
      templateUrl: "../view/index.html"
    })
});
