angular.module('indexApp').controller('GroupCreateCtrl', function($scope, $http){
    $scope.greeting = "Fill out your group details";
    var form = document.getElementById("groupCreateForm");

    $scope.checkUniqueValues = function(){
        if (form.name.value === undefined){
            $scope.message = "Please enter a group name";
            console.log($scope.message);
            return false;
        } else if (form.groupId.value === undefined){
            $scope.message = "Please enter a group web ID";
            console.log($scope.message);
            return false;
        } else if (uniqueID(form.groupId.value)){
            $scope.message = "Sorry that group web ID is taken";
            console.log($scope.message);
            return false;
        } else if (form.country.value === undefined){
            $scope.message = "Please enter the country where your youth group is located";
            console.log($scope.message);
            return false;
        } else if (form.city.value === undefined){
            $scope.message = "Please enter the city where your youth group is located";
            console.log($scope.message);
            return false;
        } else {
            $http.get('').success(function () {
                return true;
            }).error(function (err){
                console.log(err);
                return false;
            });
        }
    };

    var uniqueID = function(groupID){
        $http.get('/checkID:' + groupID).success(function (groupResults) {
            return groupResults;
        }).error(function (err){
            console.log(err);
        });
        return false;
    }
});