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

    $http.get('/checkResourceLikes/' + $routeParams.resourceID).success(function(likes){
        var button = document.getElementById("likeButton");
        $scope.likes = likes[0][0];
        if (likes[0][1]){
            button.className = "btn btn-lg bg-success";
        }
        like = function(){
            if (button.className === "btn btn-lg bg-success"){
                button.className = "btn btn-lg";
                $http.post('/removeResourceLike/' + $routeParams.resourceID).success(function(likes){
                    $scope.likes = likes[0]._id;
                }).error(function (err){
                    console.log(err);
                });
            } else {
                button.className = "btn btn-lg bg-success";
                $http.post('/addResourceLike/' + $routeParams.resourceID).success(function(likes){
                    $scope.likes = likes[0]._id;
                }).error(function (err){
                    console.log(err);
                });
            }
        }

    }).error(function (err){
        console.log(err);
    });

});

var like;
