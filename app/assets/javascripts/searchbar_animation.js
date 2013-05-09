
$(document).ready(function(){

var locationBox = $('#searchbox');
var searchComp = $('#searchcomponent');
var nav = $('#sideNav');

// $('submit').delegate('form', 'submit', function(){

// })

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
                  duration: 350,
                  specialEasing: {
                    sarah : ".71,.01,.4,.99"
                  },
                  complete : function(){
                    $(locationBox).animate({
                        height: '40px',
                        fontSize : '15px',
                        marginTop : '-70px',
                        marginLeft : '500px',
                        marginRight : '0',
                        zIndex: '2'
                      }, {
                        duration: 150,
                        specialEasing: {
                        sarah : "0,0,1,1"
                        }
            });
              locationBox.css('position', 'absolute');
              $('#go').addClass('hidden');
            }
        });
      nav.css('textAlign', 'left');
      $('#map-canvas').css('opacity', '.5');
  });



});
