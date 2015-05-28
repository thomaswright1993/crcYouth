angular.module('indexApp').controller('GroupsCtrl', function($scope, $http, $routeParams) {
    $scope.groups = [];

    var appendString = "";
    if($routeParams.searchValue !== undefined){
        appendString += "~" + $routeParams.searchValue;
    }

    $http.get('/getGroups' + appendString).success(function (groupResults) {
        for(var i = 0; i < groupResults.length; i++){
            $scope.groups.push(groupResults[i]);
        }
        console.log($scope.groups);
    }).error(function (err){
        console.log(err);
    });
});

function findGroups() {
    var searchContents = document.getElementById("groupSearch").value;
    if (searchContents === '') {
        window.location.href = '/#groups';
    } else {
        window.location.href = '/#groups~' + searchContents;
    }
}