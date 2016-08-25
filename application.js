var CONSUMER_KEY = "5SKcWzZ3hh2oplMEaCmeeDomDafzBMqQnfGGGlxU"
var API_URL = "https://api.500px.com/v1/photos/search"
var DEFAULT_SEARCH_RADIUS = "10km"
var myLatLng = {lat: 49.2827, lng: -123.1207};
var myMarkers = []
var myInfoWindows = []

function initMap() {

  var createGeocodeInfo = function(lat, lng){
    var lat = lat.toString()
    var lng = lng.toString()
    return lat + "," + lng + "," + DEFAULT_SEARCH_RADIUS
  }

  var getPhotos = function(geocodeInfo){
      jQuery.ajax({
        url: API_URL,
        method: "GET",
        data: {
          consumer_key: CONSUMER_KEY,
          geo: geocodeInfo
        },
        success: function(data){
          console.log(data);
          removeMarkers();
          data.photos.forEach(function(photoObject){
            createMarker(photoObject);
          })
        }
      })
    }

  var createMarker = function(photoObject){
    var lat = photoObject.latitude;
    var lng = photoObject.longitude;
    var coordinates = {lat: lat, lng: lng};
    var newMarker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: coordinates,
      map: map
    });
    newMarker.addListener('click', function(){
      createInfoWindow(photoObject).open(map, newMarker);
    })
    myMarkers.push(newMarker);
  }

  function removeMarkers(){
    for(i=0; i<myMarkers.length; i++){
        myMarkers[i].setMap(null);
    }
  }

  var createInfoWindow = function(photoObject){
    var src = photoObject.image_url;
    var imageTag = "<img src='" + src + "'/>";
    var infoWindow = new google.maps.InfoWindow({
      content: imageTag
    })
    myInfoWindows.push(infoWindow);
    return infoWindow
  }

  function removeInfoWindows(){
    for(i=0; i<myInfoWindows.length; i++){
        myInfoWindows[i].setMap(null);
    }
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng
  });

  var myMarker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    draggable: true,
    position: myLatLng,
    map: map,
    title: 'Vancouver'
  });

  google.maps.event.addListener(map, 'dragend', function(event){
    var center = map.getCenter();
    var lat = center.lat();
    var lng = center.lng();
    var geocodeInfo = createGeocodeInfo(lat, lng);
    getPhotos(geocodeInfo);
    console.log(lat, lng);
  });

}