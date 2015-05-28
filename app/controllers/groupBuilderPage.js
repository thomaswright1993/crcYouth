angular.module('indexApp').controller('GroupBuilderCtrl', function($scope, $http, $routeParams){
    $scope.group = [];

    $http.get('/getGroup/' + $routeParams.groupID).success(function(groupResults){
        for(var i = 0; i < groupResults.length; i++){
            $scope.group.push(groupResults[i]);
        }
        console.log($scope.group);
    }).error(function (err){
        console.log(err);
    });
});