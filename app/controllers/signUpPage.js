angular.module('indexApp').controller('SignUpCtrl', function($scope, $http, $routeParams){

    $scope.groupID = $routeParams.groupID;

    if($routeParams.groupID !== undefined){
        $http.get('/getGroup/' + $routeParams.groupID).success(function(groupResults){
            if (groupResults[0] !== undefined)
                $scope.group = groupResults;
            else
                window.location.replace("/#groups");
        }).error(function (err){
            console.log(err);
        });
    } else {
        window.location.replace("/#groups");
    }

    $http.get('/getProfile').success(function (results) {
        if (results._id !== undefined) {
            window.location.replace("/#profile");
        }
    }).error(function (err) {
        console.log(err);
    });
    $scope.greeting = "Enter Your Information";

    $http.get('/signUp').success(function (results) {
        console.log(results);
        if (results[0] !== undefined)
            $scope.message = results[0];
    }).error(function (err) {
        console.log(err);
    });

    checkFormValues = function(x){
        $scope.message = "";
        var error = false;

        if(x.name.value === "" || x.name.value === undefined){
             $scope.message = "Your name is too short\n";
             x.confirmPassword.style.color = "Red";
             error = true;
        } else x.confirmPassword.style.color = "Green";

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(x.email.value) === false){
            $scope.message = "You have entered an invalid email address!\n";
            x.email.style.color = "Red";
            error = true;
        } else x.email.style.color = "Green";

        if(x.confirmPassword.value !== x.password.value){
            $scope.message = "Make sure your password is entered correctly twice\n";
            x.confirmPassword.style.color = "Red";
            error = true;
        } else x.confirmPassword.style.color = "Green";

        if(/^[0-9A-Za-z'+!@#$%^&*]{6,24}$/.test(x.password.value) === false){
            $scope.message = "Please enter a valid password";
            x.password.style.color = "Red";
            error = true;
        } else x.password.style.color = "Green";

        return !error;
    }
});

var checkFormValues;

