angular.module('indexApp').controller('ProfileCtrl', function($scope, $http){

    $http.get('/getProfile').success(function (results) {
        if (results._id === undefined) {
            window.location.replace("/#login")
        } else {
            $scope.user = results;
        }
    }).error(function (err) {
        console.log(err);
    });
});