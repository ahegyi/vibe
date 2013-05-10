//Constraints for row/column placement of tiles.
var minTop = 30;
var maxTop = $(window).height() - 300;
var minLeft = $(window).width() / 3;
var maxLeft = $(window).width() - 500;

//Prototype for tiles
function Tile(interestingness) {
  var body = $('body');
  var tile = $('<div class="tile"></div>');
  this.tile = tile;
  this.interestingness = interestingness;
  this.topValue = getTopValue(Math.floor(Math.random() * 5) + 1);
  this.leftValue = getStartLeftValue(Math.floor(Math.random() * 4) + 1);
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
  this.move = function(left) {
    this.left = left;
    this.tile.animate({
      'left': '-=' + left + 'px'
      },
      { duration: getMovementSpeed(interestingness),
        easing:   'easeInOutSine',
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
    return Math.floor((Math.random() * (3500 - 2500)) + 2500);
  }
  else if(interestingness === 2) {
    return Math.floor((Math.random() * (4000 - 3000)) + 3000);
  }
  else if(interestingness === 3) {
    return Math.floor((Math.random() * (5000 - 3500)) + 3500);
  }
  else {
    return Math.floor((Math.random() * (6000 - 4750)) + 4750);
  }
}

$(window).ready(function() {
  var locationBox = $('#searchbox');
  var searchComp = $('#searchcomponent');
  var nav = $('#sideNav');
  var tiles = [];

  tiles.push(new Tile(1));
  tiles.push(new Tile(50));
  tiles.push(new Tile(1));
  tiles.push(new Tile(5));
  tiles.push(new Tile(100));
  tiles.push(new Tile(5));
  tiles.push(new Tile(1));
  tiles.push(new Tile(50));
  tiles.push(new Tile(5));
  tiles.push(new Tile(5));

  $('.tile').hide();

  //Search bar animation
  $('#go').on('click', function(){
    $(nav).animate({
          width : '100%',
          height : '45px',
          fontSize : '50px',
          marginTop : '-24px',
          marginLeft : '0',
          paddingLeft : '70px',
          paddingBottom : '20px',
          borderRadius : '',
          zIndex: '1'
        }, {
          duration: 1750,
          specialEasing: {
            sarah : ".71,.01,.4,.99"
        }
      }
    );
    $(locationBox).animate({
          height: '40px',
          fontSize : '15px',
          marginTop : '-70px',
          marginLeft : '500px',
          marginRight : '0',
          zIndex: '2'
      }, {
          duration: 1550,
          specialEasing: {
          sarah : "0,0,1,1"
        },
        complete: function(){
           $('.tile').show('scale');
              $.each(tiles, function(index, tile) {
                tile.move(tile.leftValue);
                console.log(tile.leftValue);
            });
          }
        }
    );
    locationBox.css('position', 'absolute');
    $('#go').addClass('hidden');
    nav.css('textAlign', 'left');
    $('#map-canvas').css('opacity', '.5');
  });
    $('body').on('click', '.tile', function(event) {
    $('body').unbind('click');
    $('.tile').stop();
    $(this).flip({
      direction: 'rl'
    });
    $(this).on('click', function() {
      $(this).revertFlip();
      $.each(tiles, function(index, tile) {
        tile.move(tile.currentLeft());
      });
    });
  });

});