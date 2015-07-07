var clickMarker;
var map;
angular.module('indexApp').controller('UpdateGroupLocationCtrl', function($scope, $http, $routeParams) {
    var mapProp = {//Google Map SetUp
            center: new google.maps.LatLng(12,148),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    if (document.getElementsByClassName("googleMap").length === 1){
        map = new google.maps.Map(document.getElementsByClassName("googleMap")[0], mapProp);
    } else {
        map = new google.maps.Map(document.getElementsByClassName("googleMap")[1], mapProp);
    }

    //For clicking and setting long/lat
    google.maps.event.addListener(map, 'click', function(event) {
        if (clickMarker !== undefined) {
            clickMarker.setMap(null);
        }
        clickMarker = new google.maps.Marker({position: event.latLng, icon: '/images/newPin.png', map: map});
        document.getElementById("latitude").value = clickMarker.position.lat();
        document.getElementById("longitude").value = clickMarker.position.lng();
    });

    $scope.groups = []; // Getting groups data from the db
    var appendString = "";
    if($routeParams.searchValue !== undefined){
        appendString += "~" + $routeParams.searchValue;
    }

    $http.get('/getGroups' + appendString).success(function (groupResults) {
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
                    "<p style='font-size: 24px'>" + this.group.city + " - " + this.group.country +
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
});

function findGroups() {
    var searchContents = document.getElementById("groupSearch").value;
    if (searchContents === '') {
        window.location.href = '/#groups';
    } else {
        window.location.href = '/#groups~' + searchContents;
    }
}

function clickTab(clickedTab) {
    var tabs = document.getElementById("tabDivs").children;
    for (var i = 0; i < tabs.length; i++){
        tabs[i].style.display = "none";
        document.getElementById(tabs[i].id+"Header" ).className = "";
    }
    document.getElementById(clickedTab).style.display = "inline";
    document.getElementById(clickedTab+"Header").className = "active";
}

function updateMap(){
    var lat = document.getElementById("latitude");
    var long = document.getElementById("longitude");
    lat.value = lat.value.replace(/[^\d.-]/g, '');
    long.value = long.value.replace(/[^\d.-]/g, '');

    var latlng;
    if (clickMarker !== undefined) {
        if (lat.value === '' || lat.value === '-'){
            lat.value = clickMarker.position.lat();
        }
        if (long.value === '' || long.value === '-'){
            long.value = clickMarker.position.lng();
        }

        latlng = new google.maps.LatLng(parseFloat(lat.value), parseFloat(long.value));
        clickMarker.setPosition(latlng);
        console.log(clickMarker.position);
    } else {
        latlng = new google.maps.LatLng(parseFloat(lat.value), parseFloat(long.value));
        clickMarker = new google.maps.Marker({position: latlng, icon: '/images/newPin.png', map: map});
    }
}