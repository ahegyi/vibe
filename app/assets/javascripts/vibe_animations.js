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
}
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
    for ( var i=0; i < picArray.length; i++ ){
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

var minTop = 30;
var maxTop = $(window).height() - 300;
var minLeft = $(window).width() / 3;
var maxLeft = $(window).width() - 500;

//Prototype for tiles
function Tile(interestingness, leftStart) {
  var body = $('body');
  var tile = $('<div class="tile"></div>');
  this.tile = tile;
  this.interestingness = interestingness;
  this.topValue = getTopValue(Math.floor(Math.random() * 5) + 1);
  this.leftValue = leftStart;
  //this.leftValue = getStartLeftValue(Math.floor(Math.random() * 4) + 1);
  tile.css({
    "top": this.topValue + 'px',
    "left": this.leftValue + 'px'
  });
  this.currentLeft = function(){return parseInt(tile.css('left'), 10);};
  switch(interestingness) {
    case 1:
      tile.addClass("small");
      break;
    case 5:
      tile.addClass("medium");
      break;
    case 50:
      tile.addClass("large");
      break;
    case 100:
      tile.addClass("extra-large");
      break;
    default:
      tile.addClass("medium");
  }

  this.setNewLeft = function(left)  {
    this.leftValue = left;
  };

  this.move = function(left) {
    this.left = left;
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

function getStartLeftValue(columnNum) {
  if(columnNum === 1) {
    return Math.floor((Math.random() * ((maxLeft - minLeft) * 0.25)) + minLeft);
  }
  else if(columnNum === 2) {
    return Math.floor((Math.random() * ((maxLeft - minLeft) * 0.25)) + (minLeft + ((maxLeft - minTop) * 0.25)));
  }
  else if(columnNum === 3) {
    return Math.floor((Math.random() * ((maxLeft - minLeft) * 0.25)) + (minLeft + ((maxLeft - minTop) * 0.50)));
  }
  else {
    return Math.floor((Math.random() * ((maxLeft - minLeft) * 0.25)) + (minLeft + ((maxLeft - minTop) * 0.75)));
  }
}

function getMovementSpeed(interestingness) {
  if(interestingness === 1) {
    return Math.floor((Math.random() * (4000 - 3000)) + 3000);
  }
  else if(interestingness === 2) {
    return Math.floor((Math.random() * (4500 - 4000)) + 4000);
  }
  else if(interestingness === 3) {
    return Math.floor((Math.random() * (5000 - 4500)) + 4500);
  }
  else {
    return Math.floor((Math.random() * (6000 - 4750)) + 4750);
  }
}

var next;

$(document).ready(function() {

  var locationBox = $('#searchbox');
  var nav = $('#sideNav');
  var tiles = [];
  var currentTileIndex = 10;

  tiles.push(new Tile(1, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(50, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(1, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(5, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(100, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(5, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(1, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(50, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(5, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(5, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(1, getStartLeftValue(Math.floor(Math.random() * 4) + 1)));
  tiles.push(new Tile(50, $(window).width()));
  tiles.push(new Tile(1, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(100, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(1, $(window).width()));
  tiles.push(new Tile(50, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(1, $(window).width()));
  tiles.push(new Tile(50, $(window).width()));
  tiles.push(new Tile(1, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(100, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(1, $(window).width()));
  tiles.push(new Tile(50, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));
  tiles.push(new Tile(5, $(window).width()));

  next = function launchNextTile(index) {
    var tile = tiles[index];
    tile.tile.show();
    tile.setNewLeft($(window).width() + 10);
    tile.move(($(window).width() + 10));

    if(currentTileIndex === tiles.length - 1) {
      _.shuffle(tiles);
      currentTileIndex = 0;
    }
    else {
      currentTileIndex += 1;
    }
  };

  $('.tile').hide();

  //Search bar animation
  $('form').submit( function(event) {
    event.preventDefault();

    var searchVal = $('#searchbox').val();

    $.ajax({
      type: 'GET',
      url: '/geocode',
      data: { "query": searchVal },
      dataType: 'json',
      success: function (data) {
        latitude = data.coordinates[0];
        longitude = data.coordinates[1];
        Map(latitude, longitude);
      },
      error: function (textStatus) {
        console.log("Sorry, there was an error geocoding '" + searchVal + "'.");
      }
    });

    $.ajax({
      type: 'GET',
      url: '/entities',
      data: { "query" : searchVal },
      dataType: 'json',
      success: function(data) {
        var picArray = data;
        getPix(picArray);
        console.log(allPixData);
      },
      error: function (textStatus) {
        console.log("poop");
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
        complete: function(){
          $.each(tiles, function(index, tile) {
            if(index < 10) {
              this.tile.show('scale');
              tile.move(tile.leftValue + 100);
              tile.setNewLeft($(window).width());
            }
          });
            currentTileIndex += 10;
          }
        }
    );

    setInterval(function(){
      next(currentTileIndex);
    }, 750);

    locationBox.css('position', 'absolute');
    $('#vibe').css('textAlign', 'left');
    $('#map-canvas').css('opacity', '.5');
  });

    // window.setInterval(function(){
    //   launchNextTile(currentTileIndex);
    // }, 2000);

    $('body').on('click', '.tile', function(event) {
      $('body').unbind('click');
      $('.tile').stop();
      $(this).addClass('detail', 750);
      // $(this).flip({
      //   direction: 'rl',
      //   content: '<p>Hello!</p>'
      //   //onEnd: function() {
      //     //$(this).addClass('detail', 1000);
      //   //}
    });

    $(this).on('click', function() {
      $(this).removeClass('detail', 750);
      // $(this).revertFlip();
      $.each(tiles, function(index, tile) {
        tile.move(tile.currentLeft());
    });
  });
});
