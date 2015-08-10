angular.module('indexApp').controller('GroupsCtrl', function($scope, $http, $routeParams) {

    var map = undefined;
    var mapProp = {
        center: new google.maps.LatLng(12,148),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if (document.getElementsByClassName("googleMap").length === 1){
        map = new google.maps.Map(document.getElementsByClassName("googleMap")[0], mapProp);
    } else {
        map = new google.maps.Map(document.getElementsByClassName("googleMap")[1], mapProp);
    }

    $scope.groups = []; // Getting groups data from the db
    var appendString = "";
    if($routeParams.searchValue !== undefined){
        appendString += "~" + $routeParams.searchValue;
    }

    $http.get('/getGroups' + appendString).success(function (groupResults) {
        if($routeParams.searchValue !== undefined){
            document.getElementById("groupSearch").value = $routeParams.searchValue;
        }

        for(var i = 0; i < groupResults.length; i++) {
            $scope.groups.push(groupResults[i]);

            // Setting each groups pin data
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(groupResults[i].lat, groupResults[i].long),
                icon: '/images/pin.png',
                group: groupResults[i]
            });

            google.maps.event.addListener(marker, 'click', function () {
                this.setVisible(false);

                var contentString = "<div><a href='/#groups/" + this.group.id + "' style='float:left'>" +
                    "<img style='border:1px solid rgba(0,0,0,0.15);'width='80'height='80'src='/images/" + this.group.imagePath + "'/></a>" +
                    "<a href='/#groups/" + this.group.id + "' style='padding-top:0;margin-top: 0; font-size: 32px'><b>" + this.group.name + "</b></a>" +
                    "<p style='font-size: 24px; color: #000000'  >" + this.group.city + " - " + this.group.country +
                    "</p></div>";

                var infowindow = new google.maps.InfoWindow({position: this.position, content: contentString});
                infowindow.open(map);

                var that = this;
                google.maps.event.addListener(infowindow, 'closeclick', function () {
                    that.setVisible(true);
                });
            });
            marker.setMap(map);
        }
        console.log($scope.groups);
    }).error(function (err){
        console.log(err);
    });

    $http.get('/getProfile').success(function (results) {
        $scope.user = results
    }).error(function (err) {
        console.log(err);
    });
});

function findGroups() {
    var searchContents = document.getElementById("groupSearch").value.replace(/[#~:/]/g,'');
    if (searchContents === '') {
        window.location.href = '/#groups';
    } else {
        window.location.href = '/#groups~' + searchContents;
    }
}

function mapsLoaders(){
    var mapDiv = document.getElementById("googleMap");
    if(mapDiv.style.display === "none"){
        mapDiv.style.display = "block";
    } else {
        mapDiv.style.display = "none";
    }
}