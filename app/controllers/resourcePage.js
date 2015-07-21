angular.module('indexApp').controller('ResourceCtrl', function($scope, $http, $routeParams){
    $scope.resources = []; // Getting resource data from the db

    var appendString = "";
    if($routeParams.searchValue !== undefined){
        appendString = "~" + $routeParams.searchValue;
    }

    $http.get('/getResources' + appendString +"/:0").success(function (resResults) {
        if($routeParams.searchValue !== undefined){
            document.getElementById("resSearch").value = $routeParams.searchValue;
        }
        for(var i = 0; i < resResults.length; i++) {
            $scope.resources.push(resResults[i]);
        }
        console.log($scope.resources);
    }).error(function (err){
        console.log(err);
    });


    var count = 20;
    function getNextPage(i){ ////Needs better paging design for dynamic content uploading and browsing
        $http.get('/getResources' + appendString + "/:" + i).success(function (resResults) {
            if (resResults.length === 0 ){
                //alert("all db now here!!")
                count -= 20;
            }
            for (var i = 0; i < resResults.length; i++) {
                $scope.resources.push(resResults[i]);
            }
            console.log(resResults);
        }).error(function (err) {
            console.log(err);
        });
    }

    $scope.loadMore = function () {
        getNextPage(count);
        count += 20
    };

});

var getNextPage;

var check_scroll;

function findResources() {
    var searchContents = document.getElementById("resSearch").value.replace(/[#~:/]/g,'');
    if (searchContents === '') {
        window.location.href = '/#resources';
    } else {
        window.location.href = '/#resources~' + searchContents;
    }
}