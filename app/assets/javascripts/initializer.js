// Google Maps Initializer, by Sarah

function initialize() {
  var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(37.397, -122.644),
      mapTypeId: google.maps.MapTypeId.ROADMAP
      }
  var layer = "toner";
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: new google.maps.LatLng(37.7, -122.4),
      zoom: 12,
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
  script.src = "http://maps.googleapis.com/maps/api/js?key=<%= GOOGLEMAPS_API_KEY %>&sensor=TRUE_OR_FALSE&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;