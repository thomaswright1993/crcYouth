app = angular.module('indexApp',['ngRoute', 'ngAnimate', 'infinite-scroll']);
app.config(function($routeProvider, $locationProvider){
      $routeProvider
          .when('/',{
              templateUrl: '/html/home.html',
              controller: 'MainCtrl'
          })
          .when('/groups',{
              templateUrl: '/html/groups.html',
              controller: 'GroupsCtrl'
          })
          .when('/login',{
              templateUrl: '/html/login.html',
              controller: 'LoginCtrl'
          })
          .when('/signUp/:groupID',{
              templateUrl: '/html/signUp.html',
              controller: 'SignUpCtrl'
          })
          .when('/events',{
              templateUrl: '/html/events.html',
              controller: 'EventsCtrl'
          })
          .when('/missions',{
              templateUrl: '/html/missions.html',
              controller: 'MissionsCtrl'
          })
          .when('/training',{
              templateUrl: '/html/training.html',
              controller: 'TrainingCtrl'
          })
          .when('/resources',{
              templateUrl: '/html/resource.html',
              controller: 'ResourceCtrl'
          })
          .when('/resources~:searchValue',{
              templateUrl: '/html/resource.html',
              controller: 'ResourceCtrl'
          })
          .when('/resources^:searchTag',{
              templateUrl: '/html/resource.html',
              controller: 'ResourceCtrl'
          })
          .when('/resource/:resourceID',{
              templateUrl: '/html/resourceTemplate.html',
              controller: 'ResourceBuilderCtrl'
          })
          .when('/createGroup',{
              templateUrl: '/html/groupCreate.html',
              controller: 'GroupCreateCtrl'
          })
          .when('/groups/:groupID',{
              templateUrl: '/html/groupTemplate.html',
              controller: 'GroupBuilderCtrl'
          })
          .when('/groups~:searchValue',{
              templateUrl: '/html/groups.html',
              controller: 'GroupsCtrl'
          })
          .when('/profile',{
              templateUrl: '/html/profile.html',
              controller: 'ProfileCtrl'
          })
          .when('/updateGroup/:groupID',{
              templateUrl: '/html/updateGroup.html',
              controller: 'UpdateGroupCtrl'
          })
          .when('/writeContentPost',{
              templateUrl: '/html/writeContentPost.html',
              controller: 'UpdateGroupLocationCtrl'
          })
          .otherwise({
              redirectTo: '/'
          });
      //$locationProvider.html5Mode(true); //Makes links weird
});

angular.module('indexApp').controller('IndexCtrl', function($scope, $http){
    $http.get('/getProfile').success(function (results) {
        if (results._id !== undefined) {
            $scope.user = results;
        }
    }).error(function (err) {
        console.log(err);
    });
});