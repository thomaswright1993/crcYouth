angular.module('indexApp').controller('ProfileCtrl', function($scope, $http){

    $http.get('/getProfile').success(function (results) {
        if (results._id === undefined) {
            window.location.replace("/#login")
        } else {
            $scope.user = results;
            console.log(results);

            $http.get('/getGroup/' + results.group.id).success(function(groupResults){
                $scope.group = groupResults;
            }).error(function (err){
                console.log(err);
            });
        }
    }).error(function (err) {
        console.log(err);
    });

    saveChanges = function(){
        document.getElementById('name').value = document.getElementById('nameBox').innerHTML;
        document.getElementById('email').value = document.getElementById('emailBox').innerHTML;
    }
});

var saveChanges;

var profileTab = function(tab){
    var ul = document.getElementById("parent");
    var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
        items[i].className = '';
    }
    document.getElementById("PASSWORD").style.display = "none";
    document.getElementById("GROUP").style.display = "none";
    document.getElementById("FACEBOOK").style.display = "none";

    document.getElementById(tab.innerText).style.display = "inline-block";
    tab.parentNode.className = "active";
};