angular.module('indexApp').controller('GroupBuilderCtrl', function($scope, $http, $routeParams){
    $scope.group = [];

    $http.get('/getGroup/' + $routeParams.groupID).success(function(groupResults){
        for(var i = 0; i < groupResults.length; i++){
            console.log(groupResults[i]);
            if (groupResults[i].splashBackPath === undefined){
                groupResults[i].splashBackPath = "crcYthSPLASHBACKnoTEXT.png";
            }
            $scope.group.push(groupResults[i]);
        }
    }).error(function (err){
        console.log(err);
    });

    $http.get('/getProfile').success(function (results) {
        $scope.user = results
    }).error(function (err) {
        console.log(err);
    });
});

function clickHeader(clickedTab) {
    var header = document.getElementById(clickedTab+"Header");
    var tab = document.getElementById(clickedTab);
    if(header.className === "active"){
        header.className = "";
        tab.style.display = "none";
    } else {
        header.className = "active";
        tab.style.display = "inline";
    }
}
