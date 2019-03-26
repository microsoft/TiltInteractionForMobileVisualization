var d3 = require("d3");
var nationData = require("./data/studyData");
var globals = require("./globals"); 

function countrySelector () {

  var checkExist;    
  globals.num_selected = 0;
  
  function getDims() {
    height = window.innerHeight;
    width = window.innerWidth;
    svg_dim = d3.min([height,width]) - 2;
    inner_padding = svg_dim * 0.1;
    chart_dim = svg_dim * 0.8;   
  }
  
  function redraw() {
  
    getDims();  

    d3.select('#selector_div').selectAll(".country_btn_enabled")
    .data(all_data, function(d) {
      return d.code;
    })
    .enter()
    .append('input')
    .attr('type','button')
    .attr('class', 'country_btn_enabled')
    .attr('id',function(d){
      return d.code + '_bttn';
    })
    .attr('value',function(d){
      return d.code;
    })
    .attr('title',function(d){
      return d.code;
    })
    .style('background',function(d){
      var scale_reg = chart_instance.scale_reg();
      var color_param = chart_instance.params().color;
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(scale_reg(d[color_param]));
      var rgb_result = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
      return 'rgba(' + rgb_result.r + ',' + rgb_result.g + ',' + rgb_result.b + ',0.5)';
    })
    .style('height', function(){
      if (height < width) {
        return ((height / 8) - 4) + 'px';
      }
      else {
        var num_rows = all_data.length / 8;
        var menubar_height = (width / 7);
        var remaining_height = height - svg_dim - menubar_height - 10; 
        return (remaining_height / num_rows - 4) + 'px';
      }
    })
    .style('width', function(){
      if (height < width) {
        var num_cols = all_data.length / 8;
        var menubar_width = (height / 7);
        var remaining_width = width - svg_dim - menubar_width; 
        return (remaining_width / num_cols - 4) + 'px';
      }
      else {        
        return ((width / 8) - 4) + 'px';
      } 
    })
    .style('margin', '2px')
    .on('touchstart', function(d){
      d3.event.preventDefault(); 
      if (d3.select(this).style('border') == '5px solid gold') {
        globals.num_selected--;
        var unselected = globals.trial_response.indexOf(!introduction_complete ? d.code : d.name);
        globals.trial_response.splice(unselected,1);
        d3.select(this).style('border', '1px solid #ccc');

        if (introduction_complete && (globals.trial_index != -1 && globals.num_selected == globals.trials[globals.trial_index].num_responses && (chart_instance.loop_count() > 0 || chart_instance.lines() == 'on'))) {
          d3.select('#progress_indicator').style('display','none');
          d3.select('#done_btn').attr('class','img_btn_enabled')
          .style('display',null)
          .attr('disabled',null)
          .attr('src', 'assets/done.svg');

        }
        else {
          d3.select('#progress_indicator').style('display',null);
          d3.select('#outer_progress_indicator')
            .attr('display', globals.condition == 'multiples' ? 'none' : null);
          d3.select('#done_btn').attr('class','img_btn_disabled')
          .style('display','none')
          .attr('disabled',true)
          .attr('src', 'assets/na.svg');
        }

        if (!non_interactive) {
          // chart_instance.outside_points().push(d.code);              
  
          var bubble_ind = chart_instance.bubbleset_points().indexOf(d.code);
          chart_instance.bubbleset_points().splice(bubble_ind,1);
  
          chart_g.call(chart_instance);
        }
      }
      else {
        if ((!introduction_complete && globals.num_selected < 3) || (introduction_complete && globals.num_selected != globals.trials[globals.trial_index].num_responses)) {
          globals.num_selected++;
          globals.trial_response.push(!introduction_complete ? d.code : d.name);
          d3.select(this).style('border', '5px solid gold');    
          
          if (introduction_complete && (globals.trial_index != -1 && globals.num_selected == globals.trials[globals.trial_index].num_responses && (chart_instance.loop_count() > 0 || chart_instance.lines() == 'on'))) {
            d3.select('#progress_indicator').style('display','none');
            d3.select('#done_btn').attr('class','img_btn_enabled')
            .style('display',null)
            .attr('disabled',null)
            .attr('src', 'assets/done.svg');

          }
          else {
            d3.select('#progress_indicator').style('display',null);
            d3.select('#outer_progress_indicator')
            .attr('display', globals.condition == 'multiples' ? 'none' : null);
            d3.select('#done_btn').attr('class','img_btn_disabled')
            .style('display','none')
            .attr('disabled',true)
            .attr('src', 'assets/na.svg');
          }          
        }
        if (!non_interactive) {
          d3.select(this).style('border', '5px solid gold');             
  
          // var outside_ind = chart_instance.outside_points().indexOf(d.code);
          // chart_instance.outside_points().splice(outside_ind,1);
          chart_instance.bubbleset_points().push(d.code);
          chart_g.call(chart_instance);                    
          
        }
      }
      if (globals.outer_progress_circle != undefined) {
        if (!introduction_complete) {
          d3.select('#inner_progress_value').attr('d', globals.inner_progress_circle.endAngle((Math.PI * 2) * (globals.num_selected / 3)));
        }
        else {
          d3.select('#inner_progress_value').attr('d', globals.inner_progress_circle.endAngle((Math.PI * 2) * (globals.num_selected / globals.trials[globals.trial_index].num_responses)));
        }
      }
      if (!introduction_complete && globals.num_selected == 3) {        
        if (globals.condition == 'multiples' || chart_instance.loop_count() >= 1) {
          d3.select('#progress_indicator').style('display','none');
          d3.select('#done_btn').attr('class','img_btn_enabled')
          .style('display',null)
          .attr('disabled',null)
          .attr('src', 'assets/done.svg');
        } 
      }
    });    
    
  } 
  
  function loadData () {     

    checkExist = setInterval(function() {
      if (all_data != undefined) {        
        
        redraw();    
        
        hideAddressBar();

        clearInterval(checkExist);
      }
    }, 100); // check every 100ms  

  } 
    
  /** INIT **/

  getDims();
  
  d3.select('body').append('div')
  .attr('id','selector_div')
  .style('height', function(){
    if (height < width) {
      return (height) + 'px';
    }
    else {
      var menubar_height = (width / 7);
      var remaining_height = height - svg_dim - menubar_height - 10; 
      return (remaining_height) + 'px';
    }
  })
  .style('width', function(){
    if (height < width) {
      var menubar_width = (height / 7);
      var remaining_width = width - svg_dim - menubar_width; 
      return (remaining_width) + 'px';
    }
    else {        
      return (width) + 'px';
    }      
  })
  .style('bottom','0px')
  .style('float', (height < width) ? 'right' : 'unset')
  .style('left', (height < width) ? (svg_dim) + 'px' : 'unset')
  .style('position', 'absolute')
  .attr('tabindex',0);
  
  all_data = nationData;     
  loadData();

}

module.exports = countrySelector;
