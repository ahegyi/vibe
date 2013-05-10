// Google Maps Initializer, by Sarah
var lat = 28.42;
var longi = 3.42;


  function initialize() {
    var layer = "toner";
    var map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: new google.maps.LatLng(parseFloat(lat), parseFloat(longi)),
        zoom: 5,
        mapTypeId: layer,
        mapTypeControlOptions: {
            mapTypeIds: [layer]
        }
    });
    map.mapTypes.set(layer, new google.maps.StamenMapType(layer));
  }

  function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=<%= ENV['GOOGLEMAPS_API_KEY'] %>&sensor=true&callback=initialize";
    document.body.appendChild(script);
  }

  window.onload = loadScript;




