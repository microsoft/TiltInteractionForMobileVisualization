var d3 = require("d3");
var globals = require("./globals");

d3.carousel = function () {

  /**

  CAROUSEL VARIABLES

  **/

  var params = {};         

  var this_carousel,
      carousel_focus = 0,
      svg_height,
      svg_width,
      focus_element;

  function carousel (selection) {
    selection.each(function (data){

      this_carousel = d3.select(this);
      this_carousel.interrupt();

      svg_height = d3.select('#carousel_svg').style('height');
      svg_height = +svg_height.substr(0,svg_height.indexOf('px'));

      svg_width = d3.select('#carousel_svg').style('width');
      svg_width = +svg_width.substr(0,svg_width.indexOf('px'));

      var center_y = svg_height * 0.5;
      var focus_height = (svg_height <= svg_width) ? (svg_width / 7 - 6) : (svg_height / 7 - 6); // same as button height

      var clutch = this_carousel.selectAll('.carousel_clutch')
      .data([null]);      
      
      var clutch_enter = clutch.enter()
      .append('g')
      .style('display','none')
      .attr('class','carousel_clutch');

      var defs = clutch_enter.append('defs');

      var grad1 = defs.append('linearGradient')
      .attr('id','grad1')
      .attr('x1','0%')
      .attr('x2','0%')
      .attr('y1','0%')
      .attr('y2','100%');

      grad1.append('stop')
      .attr('offset','0%')
      .style('stop-color','#222')
      .style('stop-opacity',1);

      grad1.append('stop')
      .attr('offset','100%')
      .style('stop-color','#333')
      .style('stop-opacity',1); 
      
      var grad2 = defs.append('linearGradient')
      .attr('id','grad2')
      .attr('x1','0%')
      .attr('x2','0%')
      .attr('y1','0%')
      .attr('y2','100%');

      grad2.append('stop')
      .attr('offset','0%')
      .style('stop-color','#333')
      .style('stop-opacity',1);

      grad2.append('stop')
      .attr('offset','100%')
      .style('stop-color','#222')
      .style('stop-opacity',1); 
     
      clutch_enter.append('rect')
      .attr('class','clutch_enabled')
      .attr('rx',5)
      .attr('ry',5)
      .style('margin', '2px')
      .style('fill','url(#grad1)')      
      .on('touchstart',clutchDown)
      .on('touchend',clutchEnd);  

      clutch_enter.append('text')
      .text('⚲')
      .attr('id','clutch_search')
      .attr('class','clutch_text')
      .attr('text-anchor', "middle")
      .attr('alignment-baseline','middle')
      .on('touchstart',clutchDown)
      .on('touchend',clutchEnd);
      
      clutch_enter.append('text')
      .text('↑')      
      .attr('class','clutch_text')
      .attr('dy','-1em')
      .attr('text-anchor', "middle")
      .attr('alignment-baseline','middle')
      .on('touchstart',clutchDown)
      .on('touchend',clutchEnd);

      clutch_enter.append('text')
      .text('↓')      
      .attr('class','clutch_text')
      .attr('dy','1em')
      .attr('text-anchor', "middle")
      .attr('alignment-baseline','middle')
      .on('touchstart',clutchDown)
      .on('touchend',clutchEnd);      

      function clutchDown() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        carousel_touching = true;
        touching = false;
        carousel_items.call(position);
        d3.select('.clutch_enabled')
        .attr('class','clutch_touch')
        .style('fill','url(#grad2)');
        d3.select('.carousel_clutch').selectAll('text')
        .style('fill','gold');
        d3.selectAll('.carousel_item').style('display','inline');
      }

      function clutchEnd() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        carousel_touching = false;
        touching = true;
        d3.select('.clutch_touch')
        .attr('class','clutch_enabled')
        .style('fill','url(#grad1)');
        d3.select('.carousel_clutch').selectAll('text')
        .style('fill','#ccc');
        // d3.selectAll('.carousel_item').style('display','none');
      }      

      var clutch_update = clutch;
      
      clutch_update.select('rect')
      .attr('width',focus_height - 4)
      .attr('height',svg_height - 4)
      .attr('x',svg_width-focus_height - 2)
      .attr('y',2);

      clutch_update.selectAll('text')
      .attr('transform','translate('+ (svg_width - 2 - 0.5 * focus_height) + ',' + (svg_height / 2) +')');
      
      clutch_update.select('#clutch_search')
      .attr('transform','translate('+ (svg_width - 2 - 0.5 * focus_height) + ',' + (svg_height / 2) +')rotate(-45)');

      clutch.exit()
      .remove();      

      var highlight_points = chart_instance.highlight_points();
      focus_element = highlight_points[carousel_focus];      

      function pinDown(item) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        carousel_touching = true;
        touching = false;     
        console.log(item);
        if (chart_instance.bubbleset_points().indexOf(item) == -1) {
          chart_instance.bubbleset_points().push(item);
          d3.select('#carousel_item_' + item).select('rect')
          .style('stroke','gold');
          // var outside_ind = chart_instance.outside_points().indexOf(item);
          // chart_instance.outside_points().splice(outside_ind,1);
          chart_g.call(chart_instance);          
        }
        else {
          var bubble_ind = chart_instance.bubbleset_points().indexOf(item);
          chart_instance.bubbleset_points().splice(bubble_ind,1);  
          d3.select('#carousel_item_' + item).select('rect').style('stroke','#fff');
          chart_g.call(chart_instance);      
          var updated_highlight_points = chart_instance.highlight_points();
          carousel_g.datum(updated_highlight_points);
          carousel_instance.carousel_focus(Math.floor((updated_highlight_points.length - 1) / 2));
          carousel_g.call(carousel_instance);
          setTimeout(function(){
            carousel_g.call(carousel_instance);
          }, 275);
          var bubbleset_points = chart_instance.bubbleset_points();
          if (bubbleset_points.length == 0 && updated_highlight_points.length == 0) {
            d3.selectAll('.carousel_item').style('display','none');       
            d3.selectAll('.carousel_clutch').style('display','none');           
          }
        } 
      }

      function pinEnd() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        carousel_touching = false;
        touching = false;       
        d3.selectAll('.carousel_item').style('display','none');
      }   
      
      function position(item) {

        var item_transition = item.transition()
        .ease(d3.easeLinear) 
        .duration(250);        

        item_transition.attr('transform',function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          var dir_from_focus = Math.sign(i - carousel_focus);
          var x_translate = (svg_width * 0.5 + 0.5 * ((focus_height * 2) - 4)) - ((focus_height * 2) - 4) * (1 - (dist_from_focus * 0.05)) - 2;
          var y_translate = 0;

          if (dist_from_focus == 0) {
            y_translate = center_y - (focus_height * 0.5) - 2;
          }
          else {
            var offset = 0;
            var j = (dir_from_focus == -1) ? 1 : 2;
            var buffer = (dir_from_focus == -1) ? 6 : 10;
            for (j; j <= dist_from_focus; j++){
              offset = offset + buffer + d3.max([0,(focus_height - 4) * (1 - (j * 0.1))]);
            }
            if (dir_from_focus == -1) {              
              y_translate = center_y - ((focus_height - 4) * 0.5) - 4 - offset;
            }
            else {
              y_translate = center_y + ((focus_height - 4) * 0.5) + 2 + offset;
            }
          }

          return 'translate('+ x_translate + ',' + y_translate + ')';
        });
        
        item_transition.select('.carousel_rect')
        .attr('x',0)
        .attr('y',0)     
        .attr('height', function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          if (dist_from_focus == 0) {            
            return (focus_height - 4);
          }
          else {
            return d3.max([0,(focus_height - 4) * (1 - (dist_from_focus * 0.1))]);
          }
        })
        .attr('width', function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          return d3.max([0,((focus_height * 2) - 4) * (1 - (dist_from_focus * 0.1))]);
        })
        .style('opacity',function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          return 1 * (1 - (dist_from_focus * 0.25));
        })        
        .attr('stroke', '#fff');

        item_transition.select('.carousel_text')    
        .attr('y', function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          if (dist_from_focus == 0) {            
            return focus_height / 2;
          }
          else {
            return d3.max([0,(focus_height - 4) * (1 - (dist_from_focus * 0.1))]) / 2;
          }          
        })
        .attr('x', function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          return d3.max([0,((focus_height * 2) - 4) * (1 - (dist_from_focus * 0.1))]) / 2;
        })
        .style('font-size',function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          return 0.7 * (1 - (dist_from_focus * 0.1)) + 'em';
        })
        .style('opacity',function(d,i){
          var dist_from_focus = Math.abs(i - carousel_focus);
          return 0.75 * (1 - (dist_from_focus * 0.25));
        });

      }      

      //carousel item enter

      var carousel_items = this_carousel.selectAll('.carousel_item')
      .data(data, function(d){
        return d;
      });

      var carousel_item_enter = carousel_items.enter()
      .append('g')
      .attr('class','carousel_item')
      .attr('id',function(d){
        return 'carousel_item_' + d;
      })
      .style('display','none')
      .attr('transform',function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        var dir_from_focus = Math.sign(i - carousel_focus);
        var x_translate = (svg_width * 0.5 + 0.5 * ((focus_height * 2) - 4)) - ((focus_height * 2) - 4) * (1 - (dist_from_focus * 0.05)) - 2;
        var y_translate = 0;

        if (dist_from_focus == 0) {
          y_translate = center_y - (focus_height * 0.5) - 2;
        }
        else {
          var offset = 0;
          var j = (dir_from_focus == -1) ? 1 : 2;
          var buffer = (dir_from_focus == -1) ? 6 : 10;
          for (j; j <= dist_from_focus; j++){
            offset = offset + buffer + d3.max([0,(focus_height - 4) * (1 - (j * 0.1))]);
          }
          if (dir_from_focus == -1) {              
            y_translate = center_y - ((focus_height - 4) * 0.5) - 4 - offset;
          }
          else {
            y_translate = center_y + ((focus_height - 4) * 0.5) + 2 + offset;
          }
        }

        return 'translate('+ x_translate + ',' + y_translate + ')';
      });

      carousel_item_enter.append('rect')
      .attr('class', 'carousel_rect')      
      .attr('rx',5)
      .attr('ry',5)      
      .attr('id',function(d){
        return d + '_bttn';
      })
      .attr('stroke', '#fff')
      .style('stroke-width','2px')
      .style('fill',function(d){
        return d3.select('.circle_mark_' + d).style('fill');
      })
      .attr('x',0)
      .attr('y',0)     
      .attr('height', function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        if (dist_from_focus == 0) {            
          return (focus_height - 4);
        }
        else {
          return d3.max([0,(focus_height - 4) * (1 - (dist_from_focus * 0.1))]);
        }
      })
      .attr('width', function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        return d3.max([0,((focus_height * 2) - 4) * (1 - (dist_from_focus * 0.1))]);
      })
      .style('opacity',function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        return 0.75 * (1 - (dist_from_focus * 0.25));
      })
      .on('touchstart', function(d){
        pinDown(d);
      })
      .on('touchend', pinEnd);

      carousel_item_enter.append('text')
      .style('font-size','0em')
      .attr('class', 'carousel_text')      
      .attr('text-anchor', "middle")
      .attr('alignment-baseline','middle')
      .text(function(d){
        return d;
      })
      .attr('y', function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        if (dist_from_focus == 0) {            
          return focus_height / 2;
        }
        else {
          return d3.max([0,(focus_height - 4) * (1 - (dist_from_focus * 0.1))]) / 2;
        }          
      })
      .attr('x', function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        return d3.max([0,((focus_height * 2) - 4) * (1 - (dist_from_focus * 0.1))]) / 2;
      })
      .style('font-size',function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        return 0.7 * (1 - (dist_from_focus * 0.1)) + 'em';
      })
      .style('opacity',function(d,i){
        var dist_from_focus = Math.abs(i - carousel_focus);
        return 0.75 * (1 - (dist_from_focus * 0.25));
      })
      .on('touchstart', function(d){
        pinDown(d);
      })
      .on('touchend', pinEnd);  

      //carousel item exit

      var carousel_items_exit = carousel_items.exit()
      .transition()
      .ease(d3.easeLinear) 
      .duration(250)
      .remove();

      carousel_items_exit.attr('transform', 'translate('+ svg_width + ',0)');     

      carousel_items_exit.select('.carousel_text')
      .style('font-size','0em');
      
       //carousel item update

      carousel_items.call(position);
      
    });

  }
  
  /**
  
    GETTER / SETTER FUNCTIONS
  
  **/

  //getter / setter for params
  carousel.params = function (x) {
    if (!arguments.length) {
      return params;
    }
    params = x;
    return carousel;
  };

  //getter / setter for this_carousel
  carousel.this_carousel = function (x) {
    if (!arguments.length) {
      return this_carousel;
    }
    this_carousel = x;
    return carousel;
  };

  //getter / setter for carousel_focus
  carousel.carousel_focus = function (x) {
    if (!arguments.length) {
      return carousel_focus;
    }
    carousel_focus = x;
    return carousel;
  };


  return carousel;

};

module.exports = d3.carousel;
