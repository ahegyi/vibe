  //Constraints for row/column placement of tiles.
  var minTop = 30;
  var maxTop = $(window).height() - 300;
  var minLeft = $(window).width() / 3;
  var maxLeft = $(window).width() - 500;

  function Tile(interestingness) {
    var body = $('body');
    var tile = $('<div class="tile"></div>');
    this.tile = tile;
    this.interestingness = interestingness;
    this.topValue = getTopValue(Math.floor(Math.random() * 5) + 1);
    this.leftValue = getStartLeftValue(Math.floor(Math.random() * 4) + 1);
    switch(interestingness) {
      case 1:
        tile.addClass("small");
        tile.css({
          "top": this.topValue + 'px',
          "left": this.leftValue + 'px'
        });
        break;
      case 5:
        tile.addClass("medium");
        tile.css({
          "top": this.topValue + 'px',
          "left": this.leftValue + 'px'
        });
        break;
      case 50:
        tile.addClass("large");
        tile.css({
          "top": this.topValue + 'px',
          "left": this.leftValue + 'px'
        });
        break;
      case 100:
        tile.addClass("extra-large");
        tile.css({
          "top": this.topValue + 'px',
          "left": this.leftValue + 'px'
        });
        break;
      default:
        tile.addClass("medium");
        tile.css({
          "top": this.topValue + 'px',
          "left": this.leftValue + 'px'
        });
    }
    this.move = function() {
      this.tile.animate({
        'left': '-=' + (this.leftValue - 30) + 'px'
        },
        { duration: getMovementSpeed(interestingness),
          easing:   'easeInOutSine',
          complete: function() {
            $(this).hide('puff', {}, 500);
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

$(document).ready(function() {

  var tiles = [];

  tiles.push(new Tile(1));
  tiles.push(new Tile(50));
  tiles.push(new Tile(100));
  tiles.push(new Tile(5));
  tiles.push(new Tile(100));
  tiles.push(new Tile(5));
  tiles.push(new Tile(1));
  tiles.push(new Tile(50));
  tiles.push(new Tile(5));
  tiles.push(new Tile(5));

  $('.tile').hide();

  var startButton = $('.start').on('click', function(){
    $('.tile').show('scale');
    $.each(tiles, function(index, tile){
      tile.move();
    });
    // tiles.animate({
    //   'left': '-=' + 800 + 'px'
    // },
    // { duration: 5000,
    //   easing:   'easeInOutSine',
    //   complete: function() {
    //     tiles.hide('puff', {}, 500);
    //   }
    // });
  });
});
