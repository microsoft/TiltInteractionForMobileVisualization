var d3 = require("d3");
// var io = require('socket.io-client');
var preLoader = require('pre-loader');
var globals = require("./globals");
var initTasks = require("./initTasks");
var sandbox = require("./sandbox");
var countrySelector = require("./countrySelector");
globals.userID = '1218_' + new Date().valueOf(); // CHANGE FOR PRODUCTION

initTasks();

scale_tilt_time = d3.scaleLinear();

scale_tilt_time.range([0.019178082191780823,1]);
scale_tilt_time.clamp(true);

scale_tilt_selection = d3.scaleLinear();

scale_tilt_selection.clamp(true);

window.appInsights = appInsights;    

appInsights.queue.push(function () {

  appinsights.context.addTelemetryProcessor(function (envelope) {
    console.log(envelope);

  });

  appInsights.context.addTelemetryInitializer(function (envelope) {

    envelope.data.baseData.client_IP = 'censored';
    envelope.data.baseData.clientip = 'censored';

    // // To set custom properties:
    envelope.data.baseData.properties = envelope.data.baseData.properties || {};
    envelope.data.baseData.properties.clientWidth = window.innerWidth;
    envelope.data.baseData.properties.clientHeight = window.innerHeight;
  });
});

/* jshint ignore:end */

non_interactive = true;

window.addEventListener('load', function() { 

  imagesArray = [    
    "assets/done.svg",
    "assets/grid.svg",
    "assets/line.svg",
    "assets/na.svg",
    "assets/next_gold.svg",
    "assets/next.svg",
    "assets/play.svg",
    "assets/prev_gold.svg",
    "assets/prev_grey.svg",
    "assets/prev.svg"
  ];

  new preLoader(imagesArray, {
    onProgress: function(img, imageEl, index){
        // fires every time an image is done or errors.
        // imageEl will be falsy if error
        // console.log('just ' +  (!imageEl ? 'failed: ' : 'loaded: ') + img);
        // imageContainer.appendChild(imageEl);
        // can access any propery of this
        // console.log(this.completed.length + this.errors.length + ' / ' + this.queue.length + ' done');
    },
    onComplete: function(loaded, errors){
        // fires when whole list is done. cache is primed.
        // console.log('assets loaded:', loaded);
        // imageContainer.style.display = 'block';
        if (errors){
            console.log('the following failed', errors);
        }
    }
  });
  
  resumptions = [];
  globals.selection_tilt_array = [];
  globals.time_tilt_array = [];
  globals.last_pause = new Date().valueOf();
  
  appInsights.trackPageView('index.html');  
  
  hideAddressBar();   

  globals.last_pause = new Date().valueOf();

  resumptions.push({
    'resumption_time': new Date().valueOf() + 1,
    'pause_time': globals.last_pause,
    'pause_duration': 1
  }); //app resumed  
  
});  

window.onfocus = function(e) {
  var r_time = new Date().valueOf();
  if (resumptions.length == 0 || globals.last_pause > resumptions[resumptions.length - 1].resumption_time && window.innerHeight > window.innerWidth) {
    resumptions.push({
      'resumption_time': r_time,
      'pause_time': globals.last_pause,
      'pause_type':'focus',
      'pause_duration': r_time - globals.last_pause
    }); //app resumed
  }
  
  globals.log_message = { 
    "TimeStamp": new Date().valueOf(),
    "user_id": globals.userID, 
    "Event": "InFocus",
    "Focus": true ,
    'resumption_time': r_time,
    'pause_time': globals.last_pause,
    'pause_type': 'focus',
    'pause_duration': r_time - globals.last_pause
  };
  
  console.log("InFocus", globals.log_message);
  appInsights.trackEvent("InFocus", globals.log_message);
};

window.onblur = function(e) {
  if (resumptions.length == 0 || resumptions[resumptions.length - 1].resumption_time > globals.last_pause) {
    globals.last_pause = new Date().valueOf(); //app paused
  }

  globals.log_message = { 
    "TimeStamp": new Date().valueOf(),
    "Event": "FocusLoss",
    "user_id": globals.userID, 
    "Focus": false 
  };
  
  console.log("FocusLoss", globals.log_message);
  appInsights.trackEvent("FocusLoss", globals.log_message);

};

window.onbeforeunload = function() { 
  socket.emit('unload', {
    userID: globals.userID,
    userAgent: navigator.userAgent
  });
  return "Your work will be lost."; 
};

window.onresize = function(e) {
  
  d3.select('#landscape_btn').remove();

  if (document.getElementById('landscape_btn')) {
    document.getElementById('landscape_btn').remove();
  }
  hideAddressBar();
  
  var checkOrientation = setInterval(function() {
    if (window.innerHeight < window.innerWidth && d3.select('#selector_div').style('height') != window.innerHeight + 'px') {
      orientation_changed = false;
      changeOrientation();    
    }
    else if (window.innerHeight > window.innerWidth && d3.select('#selector_div').style('width') != window.innerWidth + 'px') {
      orientation_changed = false;
      changeOrientation();
    }
    else {
      orientation_changed = true;
      clearInterval(checkOrientation);
    }
  }, 100);        
};

function changeOrientation () {
  if (d3.select('#main_svg') != undefined){
    chart_instance.this_chart().interrupt();
  }
  if (d3.select('#selector_div') != undefined) {
    carousel_instance.this_carousel().interrupt();
  }

  globals.log_message = { 
    "TimeStamp": new Date().valueOf(),
    "user_id": globals.userID, 
    "Event": "changeOrientation",
    "Width": window.innerWidth, 
    "Height": window.innerHeight
  };
  
  console.log("changeOrientation", globals.log_message);
  appInsights.trackEvent("changeOrientation", globals.log_message);

  height = window.innerHeight;
  width = window.innerWidth;
  svg_dim = d3.min([height,width]) - 2;
  inner_padding = svg_dim * 0.1;
  chart_dim = svg_dim * 0.8;
  globals.selection_tilt_array = [];
  globals.time_tilt_array = [];

  d3.selectAll('.toolbar')
  .style('position','absolute')
  .style('top', height < width ? '0px' : (svg_dim) + 'px')
  .style('right', height < width ? '0px' : 'unset')
  .style('width', height < width ? (height / 7) + 'px'  : width + 'px')
  .style('height',  height < width ? height + 'px' : (width / 7) + 'px');

  d3.selectAll('.img_btn_enabled')
  .style('margin', height < width ? '0px' : '2px')
  .style('height', height < width ? (height / 7 - 6) + 'px' : (width / 7 - 6) + 'px')
  .style('width', width < height ? (width / 7 - 6) + 'px' : (height / 7 - 6) + 'px'); 

  d3.selectAll(".country_btn_enabled")
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
  });

  d3.select('#selector_div')
  .style('height', function(){
    if (height < width) {
      d3.select('#annotation_div').style('height',( - 20) + 'px');
      return (height) + 'px';
    }
    else {
      var menubar_height = non_interactive ? (width / 7) : 0;
      var remaining_height = height - svg_dim - menubar_height - 10; 
      d3.select('#annotation_div').style('height',(remaining_height - 20) + 'px');
      return (remaining_height) + 'px';
    }
  })
  .style('width', function(){
    if (height < width) {
      var menubar_width = non_interactive ? (height / 7) : 0;
      var remaining_width = width - svg_dim - menubar_width; 
      d3.select('#annotation_div').style('width',(remaining_width - 20) + 'px');
      return (remaining_width) + 'px';
    }
    else {        
      d3.select('#annotation_div').style('width',(width - 20) + 'px');
      return (width) + 'px';
    }      
  })
  .style('float', (height < width) ? 'right' : 'inherit')
  .style('left', (height < width) ? (svg_dim) + 'px' : '0px')  
  .style('position', 'absolute');

  d3.selectAll('.carousel_item').style('display','none');

  d3.select('#carousel_svg').style('width',d3.select('#selector_div').style('width'));
  d3.select('#carousel_svg').style('height',d3.select('#selector_div').style('height'));

  chart_g.call(chart_instance); 
  carousel_g.call(carousel_instance);            

  globals.log_message = { 
    "TimeStamp": new Date().valueOf(),
    "user_id": globals.userID, 
    "Event": "Resized",
    "Width": window.innerWidth, 
    "Height": window.innerHeight,
    "Orientation": 'portrait'
  };
  
  console.log("Resized", globals.log_message);
  appInsights.trackEvent("Resized", globals.log_message);

}

window.addEventListener("deviceorientation", tiltHandler, true);

function tiltHandler(event) {

  if (!touching && orientation_changed) {

    var tilt_time;
    var tilt_selection;
    var now = new Date(); 
  
    scale_tilt_selection.domain([25,65]);
    scale_tilt_time.domain([2,40]);

    if (window.innerHeight > window.innerWidth) {
      tilt_time = event.gamma;
      tilt_selection = event.beta;
    }
    else {
      tilt_time = event.beta;
      tilt_selection = Math.abs(event.gamma);
    }
  
    if (globals.time_tilt_array == undefined) {
      globals.time_tilt_array = [];
    }
    globals.time_tilt_array.push(tilt_time);
    if (globals.time_tilt_array.length >= 5) {
      globals.time_tilt_array.splice(0,1);    
    }
  
    if (globals.selection_tilt_array == undefined) {
      globals.selection_tilt_array = [];
    }
    globals.selection_tilt_array.push(tilt_selection);
    if (globals.selection_tilt_array.length >= 5) {
      globals.selection_tilt_array.splice(0,1);    
    }
      
    if (last_tilt != undefined) {
      if (now.getSeconds() != last_tilt.getSeconds()) {
        last_tilt = now;           
        tps = tilt_counter;
        tilt_counter = 0;
      }    
    }
    else {
      last_tilt = now; 
    }
  
    var j = globals.time_tilt_array.length - 1;
    var consistent_time_tilt = true;
    var time_tilt_sign = 0;
    var consistent_selection_tilt = true;
    var selection_tilt_sign = 0;  
  
    time_tilt_sign = Math.sign(globals.time_tilt_array[j]);
    selection_tilt_sign = Math.sign(globals.selection_tilt_array[j] - globals.selection_tilt_array[j-1]);
    for (var i = j-1; i > 0; i--) {
      if (Math.sign(globals.time_tilt_array[i]) != time_tilt_sign) {
        consistent_time_tilt = false;
      }
      if (Math.sign(globals.selection_tilt_array[i] - globals.selection_tilt_array[i-1]) != selection_tilt_sign) {
        consistent_selection_tilt = false;
      }
    }
    
    tilt_counter++;
    
    if (document.getElementById('chart_g') != null && chart_instance.tilt() == 'on') {
    
      var param_pop = chart_instance.params().radius;
      var scale_pop = chart_instance.scale_pop();
      
      if (tilt_counter % 10) {
        chart_instance.tilt_selection(tilt_selection);      
        d3.selectAll('.country_btn_enabled')
        .style('border', function(d){
          return (chart_instance.bubbleset_points().indexOf(d.code) == -1) ? '1px solid #ccc' : '5px solid gold';
        });
  
        d3.selectAll('.mark').select('circle')
        .attr('r',function(d){
          return scale_pop(Math.sqrt(d[param_pop]));
        });
  
        var highlighted_points = chart_instance.highlight_points();     
  
        if (Math.abs(tilt_time) > 2 && !carousel_touching) {
  
          d3.selectAll('.carousel_item').style('display','none');
  
          if (consistent_time_tilt) {
            chart_instance.tilt_time(tilt_time);
            
            var year = chart_instance.current_year();
            var min_year = chart_instance.params().yearMin;
            var max_year = chart_instance.params().yearMax;
            if ((year - scale_tilt_time(Math.abs(tilt_time))) < min_year && Math.sign(tilt_time) == -1) {
              chart_instance.current_year(min_year);
            }
            else if ((year + scale_tilt_time(Math.abs(tilt_time))) > max_year && Math.sign(tilt_time) == 1){
              chart_instance.current_year(max_year);
            }
            else {
              chart_instance.current_year(year + Math.sign(tilt_time) * scale_tilt_time(Math.abs(tilt_time)));
            }    
          }    
          // var bubble_ind;
          // if (chart_instance.current_year() > 1981 && chart_instance.current_year() < 1989) {
          //   if (chart_instance.bubbleset_points().indexOf('SAU') == -1) {
          //     chart_instance.bubbleset_points().push("SAU");              
          //   }
          //   d3.select('#annotation_div').style('display',null);
          //   d3.select('#annotation_div').select('.annotation')
          //   .html('Notice the rise and fall of Saudi Arabia\'s GDP during the mid 1980s.');
          //   d3.selectAll('.carousel_item').style('display','none');       
          //   d3.selectAll('.carousel_clutch').style('display','none'); 
          // }   
          // else if (chart_instance.current_year() > 1990 && chart_instance.current_year() < 2000) {
          //   if (chart_instance.bubbleset_points().indexOf('SAU') != -1) {
          //     bubble_ind = chart_instance.bubbleset_points().indexOf('SAU');
          //     chart_instance.bubbleset_points().splice(bubble_ind,1); 
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('RWA') == -1) {
          //     chart_instance.bubbleset_points().push("RWA");              
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('GMB') == -1) {
          //     chart_instance.bubbleset_points().push("GMB");              
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('LBR') == -1) {
          //     chart_instance.bubbleset_points().push("LBR");              
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('ZAF') == -1) {
          //     chart_instance.bubbleset_points().push("ZAF");              
          //   }            
          //   d3.select('#annotation_div').style('display',null);
          //   d3.select('#annotation_div').select('.annotation')
          //   .html('Notice how the African nations diverge from one another during the 1990s.');
          //   d3.selectAll('.carousel_item').style('display','none');       
          //   d3.selectAll('.carousel_clutch').style('display','none'); 
          // }
          // else {
          //   if (chart_instance.bubbleset_points().indexOf('SAU') != -1) {
          //     bubble_ind = chart_instance.bubbleset_points().indexOf('SAU');
          //     chart_instance.bubbleset_points().splice(bubble_ind,1); 
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('RWA') != -1) {
          //     bubble_ind = chart_instance.bubbleset_points().indexOf('RWA');
          //     chart_instance.bubbleset_points().splice(bubble_ind,1); 
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('GMB') != -1) {
          //     bubble_ind = chart_instance.bubbleset_points().indexOf('GMB');
          //     chart_instance.bubbleset_points().splice(bubble_ind,1); 
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('LBR') != -1) {
          //     bubble_ind = chart_instance.bubbleset_points().indexOf('LBR');
          //     chart_instance.bubbleset_points().splice(bubble_ind,1); 
          //   }
          //   if (chart_instance.bubbleset_points().indexOf('ZAF') != -1) {
          //     bubble_ind = chart_instance.bubbleset_points().indexOf('ZAF');
          //     chart_instance.bubbleset_points().splice(bubble_ind,1); 
          //   }            
          //   d3.select('#annotation_div').style('display','none');
          //   d3.select('#annotation_div').select('.annotation')
          //   .html('');
          // }
          chart_g.call(chart_instance);  
        }    
  
        else if (highlighted_points.length > 0 && carousel_touching) {
          highlighted_points.sort(function(x, y){
            return d3.ascending(x, y);
          });
  
          d3.selectAll('.carousel_item').style('display','inline');
  
          scale_tilt_selection.range([0,(highlighted_points.length-1)]);
  
          if (consistent_selection_tilt) {
            var highlighted_point_index = 0;
            var selection_tilts = 0;
            for (var g = globals.selection_tilt_array.length - 1; g >= 0; g--){
              selection_tilts = selection_tilts + globals.selection_tilt_array[g];
            }
            if (selection_tilt_sign == 1) {
              highlighted_point_index = Math.round(scale_tilt_selection(selection_tilts / globals.selection_tilt_array.length));
              if (highlighted_point_index > highlighted_points-1){
                highlighted_point_index = highlighted_points - 1;
              }
            }
            else if (selection_tilt_sign == -1){
              highlighted_point_index = Math.round(scale_tilt_selection(selection_tilts / globals.selection_tilt_array.length));
              if (highlighted_point_index < 0){
                highlighted_point_index = 0;
              }
            }
                     
            if (globals.highlighted_point != highlighted_points[highlighted_point_index]) {
              globals.highlighted_point = highlighted_points[highlighted_point_index];
              carousel_instance.carousel_focus(highlighted_point_index);
              carousel_g.call(carousel_instance); 
              var node_r = d3.select('#mark_' + globals.highlighted_point).select('circle').attr('r');        
              d3.select('#mark_' + globals.highlighted_point).select('circle')
              .transition()
              .ease(d3.easeCubic)
              .duration(250)
              .attr('r', (node_r * 1.5))
              .style('stroke-width','2px')
              .transition()
              .ease(d3.easeCubic)
              .duration(250)
              .attr('r', node_r)
              .style('stroke-width','1px');
            }       
          }
          
          d3.select('#' + globals.highlighted_point + '_bttn')
          .style('border', '5px solid cyan');
            
          var node = document.getElementById('mark_' + globals.highlighted_point);
          node.parentElement.appendChild(node);
          chart_g.call(chart_instance);   
        
        }
        

      }
    }
  }
  else {
    carousel_touching = false;
  }
}

d3.select("body")
.on("keydown", function () {    
  
  switch(d3.event.keyCode) {    

    case 27: // test override on 'Esc' and load menu
      test_override = true;

      globals.trial_index = -1;

      globals.animation = 'off';
      globals.lines = 'off';
      globals.facets = 'off';

      globals.log_message = { 
        "TimeStamp": new Date().valueOf(),
        "Event": "Escape",
        "user_id": globals.userID
      };
      
      console.log("Escape", globals.log_message);
      appInsights.trackEvent("Escape", globals.log_message);

      if (document.getElementById('selector_div') != undefined) {      
        document.getElementById('selector_div').remove();                    
      } 
     
      if (document.getElementsByTagName('div')[0] != undefined) {        
               
        document.getElementsByTagName('div')[0].remove();   
        
        globals.log_message = { 
          "TimeStamp": new Date().valueOf(),
          "Event": "TestOverride_Load_Menu",
          "user_id": globals.userID
        };
        
        console.log("TestOverride_Load_Menu", globals.log_message);
        appInsights.trackEvent("TestOverride_Load_Menu", globals.log_message);

        
        loadSandbox();
        hideAddressBar();
      }           
    break;    

    default:      
    break;
  }    

});

loadSandbox = function () {

  globals.trial_index = 0;
  non_interactive = false;
  test_override = true;    

  globals.log_message = { 
    "TimeStamp": new Date().valueOf(),
    "Event": "SandBox_Open",
    "user_id": globals.userID
  };
  
  console.log("SandBox_Open", globals.log_message);
  appInsights.trackEvent("SandBox_Open", globals.log_message);

  setTimeout(function(){
    // Hide the address bar!
		sandbox();  
  }, 100);
  hideAddressBar(); 
};

globals.log_message = { 
  "TimeStamp": new Date().valueOf(),
  "Event": "NewParticipant",
  "userAgent": navigator.userAgent,
  "user_id": globals.userID
};

console.log("NewParticipant", globals.log_message);
appInsights.trackEvent("NewParticipant", globals.log_message);

loadSandbox();

d3.select('body').append('svg')
.style('display','none')
.attr('xmlns','http://www.w3.org/2000/svg')
.attr('version','1.1')
.attr('height','0')
.append('filter')
.attr('id','myblurfilter')
.attr('width','110%')
.attr('height','110%')
.append('feGaussianBlur')
.attr('stdDeviation','30')
.attr('result','blur');