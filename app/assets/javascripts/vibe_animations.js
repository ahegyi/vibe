var random_places = {
  "San Francisco":[37.77492909600045, -122.41941943099971],
  "Phillippines":[12.99999769900046, 121.99999988200057],
  "New York":[40.714267332000475, -74.00596989999963],
  "London":[51.50852615600047, -0.12573883899955263],
  "Tokyo":[35.68949711500045, 139.69170993600062],
  "Paris":[48.8534093560005, 2.348796127000412],
  "Cyprus":[34.99999588200046, 32.99999659800045],
  "Mumbai":[19.072827430000473, 72.88260923100052],
  "Athens":[37.97944991500049, 23.716215660000444],
  "Rome":[41.89473822600047, 12.483895930000415],
  "Washington D.C.": [38.895107049000444, -77.03636627099968],
  "Boston": [42.358425544000454, -71.05976945499964],
  "Nassau": [25.058225872000435, -77.34305975299964]
};
// Google Maps Initializer, by Sarah
function defaultMap(){
  var random_place = _.shuffle(random_places);
  var defaultLatitude = (random_place)[0][0];
  var defaultLongitude = (random_place)[0][1];
  var center = new google.maps.LatLng(defaultLatitude, defaultLongitude);
  var layer = "toner";
  var mapOptions = {
      center: center,
      zoom: 5,
      mapTypeId: layer,
      mapTypeControlOptions: {
        mapTypeIds: [layer]
      }
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  map.mapTypes.set(layer, new google.maps.StamenMapType(layer));
}

function Map(latitude, longitude){
  var center = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
  var layer = "toner";
  var mapOptions = {
      center: center,
      zoom: 8,
      mapTypeId: layer,
      mapTypeControlOptions: {
        mapTypeIds: [layer]
      }
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  map.mapTypes.set(layer, new google.maps.StamenMapType(layer));
  }

window.onload = defaultMap;

var allPixData;

function getPix(picArray){
  allPixData = [];
  for (var i = 0; i < picArray.length; i += 1){
    var picLink = picArray[i]['media_url'];
    var picInterestingness = picArray[i]['interestingness'];
    var picSource = picArray[i]['source'];
    var picUserData = picArray[i]['username'];
    allPixData.push({
      "link": picLink,
      "interestingness": picInterestingness,
      "source": picSource,
      "username": picUserData
    });
  }
}

var minTop = 50;
var maxTop = $(window).height() - 300;
var minLeft = $(window).width() / 3;
var maxLeft = $(window).width() - 500;

//Prototype for tiles
function Tile(interestingness, link, source, userName) {
  var body = $('body');
  var tile = $('<div class="tile"><img src="' + link + '"></div>');
  this.tile = tile;
  this.interestingness = interestingness;
  this.topValue = getTopValue(Math.floor(Math.random() * 5) + 1);
  this.leftValue = ($(window).width() + 10);
  tile.css({
    "top": this.topValue + 'px',
    "left": this.leftValue + 'px'
  });
  this.currentLeft = function(){return parseInt(tile.css('left'), 10);};
  switch(interestingness) {
    case (interestingness === 0 || interestingness < 20):
      tile.addClass("small");
      break;
    case (interestingness > 20 || interestingness < 50):
      tile.addClass("medium");
      break;
    case (interestingness > 50 || interestingness < 70):
      tile.addClass("large");
      break;
    case (interestingness > 70 || interestingness <= 100):
      tile.addClass("extra-large");
      break;
    default:
      tile.addClass("medium");
  }

  this.move = function(left) {
    this.tile.animate({
      'left': '-=' + left + 'px'
      },
      { duration: getMovementSpeed(interestingness),
        specialEasing: {
          tileMove: '0,1.01,.56,.87'
        },
        complete: function() {
          $(this).hide('puff', {percent: 125}, 500);
        }
    });
  };

  body.append(tile);
}

var tiles;
var currentTileIndex = 0;

function generateTiles() {
  for(var i = 0; i < allPixData.length; i += 1) {
    var interestingness = allPixData[i].interestingness;
    var link = allPixData[i].link;
    var source = allPixData[i].source;
    var userName = allPixData[i].username;

    tiles.push(new Tile(interestingness, link, source, userName));
  }
}

function launchNextTile(index) {
  var tile = tiles[index];
  // tile.setNewLeft(($(window).width() + 10));
  tile.tile.show();
  tile.move(($(window).width() + 10));

  if(currentTileIndex === tiles.length - 1) {
    _.shuffle(tiles);
    currentTileIndex = 0;
  }
  else {
    currentTileIndex += 1;
  }
}

function getTopValue(rowNum) {
  if(rowNum === 1) {
    return Math.floor((Math.random() * ((maxTop - minTop) * 0.20)) + minTop);
  }
  else if(rowNum === 2) {
    return Math.floor((Math.random() * ((maxTop - minTop) * 0.20)) + (minTop + ((maxTop - minTop) * 0.20)));
  }
  else if(rowNum === 3) {
    return Math.floor((Math.random() * ((maxTop - minTop) * 0.20)) + (minTop + ((maxTop - minTop) * 0.40)));
  }
  else if(rowNum === 4) {
    return Math.floor((Math.random() * ((maxTop - minTop) * 0.20)) + (minTop + ((maxTop - minTop) * 0.60)));
  }
  else {
    return Math.floor((Math.random() * ((maxTop - minTop) * 0.20)) + (minTop + ((maxTop - minTop) * 0.80)));
  }
}

function getMovementSpeed(interestingness) {
  if(interestingness === 0 || interestingness < 30) {
    return Math.floor((Math.random() * (4500 - 3500)) + 3500);
  }
  else if(interestingness > 30 || interestingness < 60) {
    return Math.floor((Math.random() * (5500 - 5000)) + 5000);
  }
  else if(interestingness > 60 || interestingness < 100) {
    return Math.floor((Math.random() * (6500 - 5500)) + 5500);
  }
  else {
    return Math.floor((Math.random() * (7500 - 6000)) + 6000);
  }
}

$(document).ready(function() {

  var locationBox = $('#searchbox');
  var nav = $('#sideNav');
  tiles = [];

  //Search bar animation
  $('form').submit( function(event) {
    event.preventDefault();

    $.ajaxSetup({
      beforeSend: function(){
          $('.loader').show();
      },
      complete: function(){
          $('.loader').hide();
      }
    });

    $.ajax({
      type: 'GET',
      url: '/geocode',
      data: { "query": $('#searchbox').val() },
      dataType: 'json',
      success: function (data) {
        latitude = data.coordinates[0];
        longitude = data.coordinates[1];
        Map(latitude, longitude);
      },
      error: function (textStatus) {
        console.log("Sorry, there was an error geocoding '" + $('#searchbox').val() + "'.");
      }
    });

    $.ajax({
      type: 'GET',
      url: '/entities',
      data: { "query" : $('#searchbox').val() },
      dataType: 'json',
      success: function(data) {
        var picArray = data;
        getPix(picArray);
        generateTiles();
        $('.tile').hide();

        window.setInterval(function(){
          launchNextTile(currentTileIndex);
        }, 500);

        $('body').on('click', '.tile', function(event) {
          $('body').unbind('click');
          $('.tile').stop();
          $(this).addClass('detail', 750);
        });

        $(this).on('click', function() {
          $(this).removeClass('detail', 750);
          $.each(tiles, function(index, tile) {
            tile.move(tile.currentLeft());
          });
        });
      },
      error: function (textStatus) {
        console.log(textStatus);
      }
    });

    $(nav).animate({
        width : '100%',
        height : '20px',
        fontSize : '120%',
        letterSpacing: '1em',
        marginTop : '0',
        marginLeft : '0',
        paddingTop: '0.4%',
        paddingLeft: '1%',
        paddingBottom : '3%',
        borderRadius : '',
        zIndex: '1'
      }, {
        duration: 750,
        specialEasing: {
          sarah : ".71,.01,.4,.99"
        }
      }
    );

    $(locationBox).animate({
      height: '40px',
      fontSize : '20px',
      marginTop: '-50px',
      marginLeft : '50%',
      marginRight : '0%',
      zIndex: '2'
      }, {
      duration: 550,
      specialEasing: {
      sarah : "0,0,1,1"
      },
      complete: function(){}
      }
    );

    locationBox.css('position', 'absolute');
    $('#vibe').css('textAlign', 'left');
    $('#map-canvas').css('opacity', '.5');
  });
});
