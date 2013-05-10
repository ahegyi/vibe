// Google Maps Initializer, by Sarah

function initialize() {
  var layer = "toner";
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: new google.maps.LatLng(48.87, 2.347),
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
  script.src = "http://maps.googleapis.com/maps/api/js?key=<%= ENV['GOOGLEMAPS_API_KEY'] %>&sensor=TRUE_OR_FALSE&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;