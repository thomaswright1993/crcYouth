angular.module('indexApp').controller('SignUpCtrl', function($scope, $http){
    $http.get('/getProfile').success(function (results) {
        if (results._id !== undefined) {
            window.location.replace("/#profile");
        }
    }).error(function (err) {
        console.log(err);
    });
    $scope.greeting = "Enter Your Information";

    $http.get('/getSignUp').success(function (results) {
        if (results[0] !== undefined)
            $scope.message = results[0];
    }).error(function (err) {
        console.log(err);
    });
});