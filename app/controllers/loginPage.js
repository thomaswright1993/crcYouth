angular.module('indexApp').controller('LoginCtrl', function($scope, $http){
    $http.get('/getProfile').success(function (results) {
        if (results._id !== undefined) {
            window.location.replace("/#profile");
        }
    }).error(function (err) {
        console.log(err);
    });
    $scope.greeting = "Please Login";

    $http.get('/getLogin').success(function (results) {
        if (results[0] !== undefined)
            $scope.message = results[0];
    }).error(function (err) {
        console.log(err);
    });
});

function checkForm(){
    var x = document.getElementById("loginForm");
    var error = false;
    var errorMessage = "";

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(x.email.value) === false){
        errorMessage += "You have entered an invalid email address!\n";
        error = true;
        x.email.style.color = "Red";
    } else x.email.style.color = "Green";

    if(/^[0-9A-Za-z'+!@#$%^&*]{6,24}$/.test(x.password.value) === false){
        errorMessage += "Please Enter a Valid Password\n";
        error = true;
        x.password.style.color = "Red";
    } else x.password.style.color = "Green";

    return errorMessage;
}

function checkSubmitForm(){
    return checkForm() === "";
}
