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
          .when('/updateGroupLocation',{
              templateUrl: '/html/updateGroupLocation.html',
              controller: 'UpdateGroupLocationCtrl'
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

function MM_swapImgRestore() { //Turn img back on mouse off
    var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //Get the img for the other swapImage()
    var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
        d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
    if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
    for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
    if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //Swap the img on hover
    var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
        if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}