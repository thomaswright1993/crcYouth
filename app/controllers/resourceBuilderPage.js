angular.module('indexApp').controller('ResourceBuilderCtrl', function($scope, $http, $routeParams){
    $scope.resource = [];

    $http.get('/getResource/' + $routeParams.resourceID).success(function(resResults){
        for(var i = 0; i < resResults.length; i++){
            $scope.resource.push(resResults[i]);
            $scope.resource[0].date = new Date($scope.resource[0].date).toString();
            }
        document.getElementById('body').innerHTML = $scope.resource[0].body;
        console.log($scope.resource);
    }).error(function (err){
        console.log(err);
    });
});
