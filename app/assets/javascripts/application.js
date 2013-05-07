function initialize() {
  var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(37.397, -122.644),
      mapTypeId: google.maps.MapTypeId.ROADMAP
      }
  var layer = "toner";
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: new google.maps.LatLng(37.7, -122.4),
      zoom: 8,
      mapTypeId: layer,
      mapTypeControlOptions: {
          mapTypeIds: [layer]
      }
  }); 
  map.mapTypes.set(layer, new google.maps.StamenMapType(layer));
}
