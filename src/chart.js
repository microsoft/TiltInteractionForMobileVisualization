var d3 = require("d3");
var flubber = require("flubber");
var globals = require("./globals");
var circlefit = require("./circlefit");
var annotationList = require("./data/annotationList");

d3.chart = function () {  

  /**

  GLOBAL CHART VARIABLES

  **/

  var params = {};
      params.yearMin = globals.param_yearMin;
      params.yearMax = globals.param_yearMax;      
      params.x = globals.param_x;
      params.y = globals.param_y;
      params.radius = globals.param_r;
      params.color = 'region';
      params.facet = 'facet';
      params.key = 'code';
  
  var scale_pop = d3.scaleLinear(), 
      scale_x = d3.scaleLinear(), 
      scale_y = d3.scaleLinear(), 
      scale_scroll = d3.scaleLinear(),
      scale_reg = d3.scaleOrdinal(),
      scale_tmp = d3.scaleLinear(),
      bubbles = new BubbleSet(),
      highlight_points = [],
      bubbleset_points = [],
      outside_points = [],
      bubbleset_outline = "M0 0",
      bubbleset_pad = -3,
      bubbleset_coords = [],
      outside_coords = [],
      bubble_code = "",
      bubble_node,
      animation = 'off',
      loop_count = 0,
      animation_duration = (params.yearMax - params.yearMin) * 500,
      tilt = 'off',
      tilt_selection = 0,
      tilt_time = 0,
      current_year = params.yearMin,
      scroll_year = current_year,
      facets = globals.facets, //show facets?
      num_facets = 0,
      num_facet_cols = 0,
      facet_dim = 0,
      lines = globals.lines, //show lines?
      focus_x = -1,
      focus_y = -1,
      focus_x_lower = -1,
      focus_x_upper = -1,
      focus_y_upper = -1,
      focus_y_lower = -1,
      focus_y_facet = -1,
      this_chart,
      thousand_format = d3.format(".2s"),
      touch_counter = 0,
      last_touch = new Date(),
      touch_points = [],
      caption_text = "",
      annotation_points = [];

  function chart (selection) {
    selection.each(function (data){

      this_chart = d3.select(this);
      this_chart.interrupt();

      var bubbleset = this_chart.selectAll('.bubbleset')
      .data([null]);

      /**

      FOCUS

      **/

      var focus = this_chart.selectAll('.focus')
      .data([null]);
      
      var focus_enter = focus.enter()
      .append("g")
      .attr("class", "focus");      

      focus_enter.append('text')
      .attr('class','focus_text')
      .attr('text-anchor', "start")
      .attr('alignment-baseline','hanging')
      .attr('dy','0.2em')
      .attr('id','focus_x_min');

      focus_enter.append('text')
      .attr('class','focus_text')
      .attr('text-anchor', "end")
      .attr('alignment-baseline','hanging')
      .attr('dy','0.2em')
      .attr('id','focus_x_max');

      focus_enter.append('text')
      .attr('class','focus_text')
      .attr('text-anchor', "end")
      .attr('alignment-baseline','baseline')
      .attr('dx','-0.2em')
      .attr('dy','-1em')
      .attr('id','focus_y_min');

      focus_enter.append('text')
      .attr('class','focus_text')
      .attr('text-anchor', "end")
      .attr('alignment-baseline','hanging')
      .attr('dx','-0.2em')
      .attr('id','focus_y_max');      

      var focus_update = focus;

      var focus_exit = focus.exit()
      .remove();

      /**

      DATA WRANGLING

      **/

      //sort data alphabetically by country code
      data.sort(function(x, y){
        return d3.ascending(x[params.key], y[params.key]);
      });

      //assign facet index
      data.forEach(function(d,i){
        d[params.facet] = i;
      });

      num_facets = d3.max(data, function(d){
        return d[params.facet] + 1;
      });

      num_facet_cols = Math.ceil(Math.sqrt(num_facets));

      facet_dim = chart_dim / num_facet_cols;

      focus_enter.append('rect')
      .attr('id','focus_rect_x')
      .attr("x",0)      
      .style('fill','#666')
      .style('stroke','none')
      .style('opacity',0.2)
      .attr("width",facet_dim)
      .attr('y', 0)
      .attr('height', chart_dim)      
      .style("display", "none");

      focus_enter.append('rect')
      .attr('id','focus_rect_y')
      .attr("x",0)      
      .style('fill','#666')
      .style('stroke','none')
      .style('opacity',0.2)
      .attr("width",chart_dim)
      .attr('y', 0)
      .attr('height', facet_dim)
      .style("display", "none");

      var countries = data.map(function(d){
        return {
          id: d.code,
          region: d.region,
          facet: d.facet,
          param_x: d[params.x].map(function(d) {
            return d[1];
          }),
          param_y: d[params.y].map(function(d) {
            return d[1];
          })
        };
      });

      countries.forEach(function(d){
        d.values = [];
        for(var i = 0; i < d.param_x.length; i++){
          if (d.param_x[i] != null && d.param_y[i] != null) {
            d.values.push({
              'param_x': d.param_x[i],
              'param_y': d.param_y[i]
            });
          }
        }
      }); 
      
      /**

      SCALES: initialize domains and ranges

      **/

      //region scale (color)

      scale_reg.range([
        "#fad139",
        "#54b2fc",
        "#f67afe",
        "#8bba32",
        "#c29aeb"]
        // ["#ffd700",
        // "#cd34b5",
        // "#7dfa90",
        // "#fa8775",
        // "#a779e6",
        // "#9AF7F9"]
      );

      //size scale

      if (facets == 'on') {
        scale_pop.range([1.75,7]); // r scale range      
      }
      else {
        scale_pop.range([7,28]); // r scale range      
      }
      
      var pop_max = d3.max(data, function(d){
        return d3.max(d[params.radius], function (dd) {
          return Math.sqrt(dd[1]);
        });
      });
      
      var pop_buffer = pop_max * 0.05;
      
      scale_pop.domain([0,pop_max + pop_buffer]);
      scale_pop.nice();

      //y scale

      if (facets == 'on') {
        scale_y.range([facet_dim, 0]); // y scale range
      }
      else {
        scale_y.range([chart_dim, 0]); // y scale range
      }
      
      var y_min = d3.min(data, function(d){
        return d3.min(d[params.y], function (dd){
          return dd[1];
        });
      });
      
      var y_max = d3.max(data, function(d){
        return d3.max(d[params.y], function (dd) {
          return dd[1];
        });
      });
      
      var y_buffer = (y_max - y_min) * 0.05;
      
      scale_y.domain([d3.max([0,y_min - y_buffer]),y_max + y_buffer]);
      scale_y.nice();

      
      //x scale
      
      if (facets == 'on') {
        scale_x.range([0, facet_dim]); // x scale range
      }
      else {
        scale_x.range([0, chart_dim]); // x scale range
      }
      
      var x_min = d3.min(data, function(d){
        return d3.min(d[params.x], function (dd){
          return dd[1];
        });
      });
      
      var x_max = d3.max(data, function(d){
        return d3.max(d[params.x], function (dd) {
          return dd[1];
        });
      });
      
      var x_buffer = (x_max - x_min) * 0.05;
      
      scale_x.domain([d3.max([0,x_min - x_buffer]),x_max + x_buffer]);
      scale_x.nice();

      // time scale

      scale_tmp.range([-5,5]);
      scale_tmp.domain([-0.5,0.5]);
      scale_tmp.clamp(true);
      scale_tmp.nice();
      scale_tmp.tickFormat(d3.format("d"));

      //SCROLL RING SCALE

      scale_scroll.range([-(4/12),(4/12)]);
      scale_scroll.domain([-10,10]);
      scale_scroll.clamp(true);

      /** 
       
      DEFS: add as required 
      
      **/
     
      /** 
      
        GUIDES / AXES

      **/

     var gamma_indicator = this_chart.selectAll('.gamma_indicator')
     .data([null]);

      gamma_indicator.enter()
      .append("text")
      .attr("class", "gamma_indicator")
      .attr('text-anchor', "start")
      .attr('alignment-baseline','baseline');

      gamma_indicator.style('visibility',non_interactive ? 'hidden' : 'visible')
      .attr('transform', function () {
        return 'translate(0,' + (0 - 0.5 * inner_padding) + ')';
      })
      .attr('dy','-0.2em')
      .text(non_interactive && tilt == 'on' ? '' : 'x: ' + (Math.round(tilt_time) + "° : " + tps + " tilts / second")); 


      gamma_indicator.exit()
      .remove();

      var beta_indicator = this_chart.selectAll('.beta_indicator')
     .data([null]);

      beta_indicator.enter()
      .append("text")
      .attr("class", "beta_indicator")
      .attr('text-anchor', "end")
      .attr('alignment-baseline','baseline');

      beta_indicator.style('visibility',non_interactive ? 'hidden' : 'visible')
      .attr('transform', function () {
        return 'translate(' + (chart_dim) + ',' + (0 - 0.5 * inner_padding) + ')';
      })
      .attr('dy','-0.2em')
      .text(non_interactive && tilt == 'on' ? '' : 'y: ' + (Math.round(tilt_selection) + "°")); 

      beta_indicator.exit()
      .remove();

      year_indicator = this_chart.selectAll('.year_indicator')
      .data([null]);

      year_indicator.enter()
      .append("text")
      .attr("class", "year_indicator");

      year_indicator.transition().duration(250)
      .attr('id', facets == 'on' ? "faceted_year_indicator" : (current_year == params.yearMin) ? "central_year_indicator_min" : "central_year_indicator")
      .attr('text-anchor', facets == 'on' ? "middle" : "middle")
      .attr('alignment-baseline',facets == 'on' ?  'baseline' : 'middle')
      .attr('dy',facets == 'on' ?  '-0.2em' : '0em')
      .attr('transform', function () {
        return facets == 'on' ? 'translate(' + (chart_dim / 2) + ',' + (0 - 0.5 * inner_padding) + ')' : 'translate(' + (chart_dim / 2) + ',' + (chart_dim / 2) + ')';
      })
      .text(facets == 'on' ? (params.yearMin + ' ― ' + params.yearMax) : Math.round(current_year));

      year_indicator.exit()
      .remove();

      var x_indicator = this_chart.selectAll('.x_indicator')
      .data([null]);

      var x_indicator_enter = x_indicator.enter()
      .append("g")
      .attr("class", "x_indicator");

      x_indicator_enter.append('line');

      x_indicator.select('line').attr('x1', 0)
      .attr('x2', chart_dim)
      .attr('y1', chart_dim)
      .attr('y2', chart_dim)
      .style("stroke", facets == 'on' ? 'none' : '#ccc');

      x_indicator_enter.append("text")
      .attr('class','indicator_text');

      x_indicator.select('text').attr('text-anchor', "middle")
      .attr('alignment-baseline','hanging')
      .attr('dy','0.2em')
      .text('← ' + params.x + (!non_interactive ? ' ▼' : '') + ' →')
      .attr('transform', function () {
        return 'translate(' + (chart_dim / 2) + ',' + (chart_dim + inner_padding * 0.5) + ')';
      });

      x_indicator.exit()
      .remove();

      var y_indicator = this_chart.selectAll('.y_indicator')
      .data([null]);

      var y_indicator_enter = y_indicator.enter()
      .append("g")
      .attr("class", "y_indicator");

      y_indicator_enter.append('line');

      y_indicator.select('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', chart_dim)
      .style("stroke", facets == 'on' ? 'none' : '#ccc');

      y_indicator_enter.append("text")
      .attr('class','indicator_text');

      y_indicator.select('text')
      .attr('text-anchor', "middle")
      .attr('alignment-baseline','baseline')
      .attr('dy','-0.6em')
      .text('← ' + params.y + (!non_interactive ? ' ▼' : '') + ' →')
      .attr('transform', function () {
        return 'translate(' + (0 - inner_padding * 0.5) + ',' + (chart_dim / 2) + ')rotate(-90)';
      });

      y_indicator.exit()
      .remove();

      focus_x_lower = facets == 'on' ? scale_x.domain()[0] : Math.floor(scale_x.invert(focus_x * facet_dim));      
      focus_x_upper = facets == 'on' ? scale_x.domain()[1] : Math.ceil(scale_x.invert((focus_x + 1) * facet_dim));

      focus_y_lower = facets == 'on' ? scale_y.domain()[0] : Math.floor(scale_y.invert((focus_y + 1) * facet_dim));
      focus_y_upper = facets == 'on' ? scale_y.domain()[1] : Math.ceil(scale_y.invert(focus_y * facet_dim));      
      focus_y_facet = (num_facet_cols - 1) - focus_y;        

      // console.log({
      //   "type":"update",
      //   "focus_x":focus_x,
      //   "focus_y":focus_y,
      //   "focus_x_lower": focus_x_lower,
      //   "focus_x_upper": focus_x_upper,
      //   "focus_y_lower": focus_y_lower,
      //   "focus_y_upper": focus_y_upper
      // });

      focus_update.select('#focus_x_min')
      .attr('x', function () {
        if (focus_x < 0) {
          return 0;
        }
        else {
          if (facets == 'on') {
            return d3.max([0,focus_x * facet_dim]);
          }
          else {
            return d3.max([scale_x(focus_x_lower),scale_x.range()[0]]);
          }
        }
      }) 
      .text(function () {
        if (focus_x < 0 || facets == 'on') {
          return scale_x.domain()[1] < 1000 ? scale_x.domain()[0] : thousand_format(scale_x.domain()[0]).replace(/G/,"B");
        }
        else {
          return scale_x.domain()[1] < 1000 ? d3.max([focus_x_lower,scale_x.domain()[0]]) : thousand_format(d3.max([focus_x_lower,scale_x.domain()[0]])).replace(/G/,"B");
        }
      }) 
      .attr('y', chart_dim);

      focus_update.select('#focus_x_max')
      .attr('x', function () {
        if (focus_x < 0) {
          return scale_x.range()[1];
        }
        else {
          if (facets == 'on') {
            return d3.min([chart_dim - facet_dim,(focus_x + 1) * facet_dim]);
          }
          else {
            return d3.min([scale_x(focus_x_upper),scale_x.range()[1]]);
          }
        }
      }) 
      .text(function () {
        if (focus_x < 0 || facets == 'on') {
          return scale_x.domain()[1] < 1000 ? scale_x.domain()[1] : thousand_format(scale_x.domain()[1]).replace(/G/,"B");
        }
        else {
          return scale_x.domain()[1] < 1000 ? d3.min([focus_x_upper,scale_x.domain()[1]]) : thousand_format(d3.min([focus_x_upper,scale_x.domain()[1]])).replace(/G/,"B");
        }
      }) 
      .attr('y', chart_dim);

      focus_update.select('#focus_y_min')
      .attr('x', 0)
      .attr('y', function () {
        if (focus_y < 0) {
          return chart_dim;
        }
        else {
          if (facets == 'on') {
            return d3.min([chart_dim - facet_dim,(focus_y + 1) * facet_dim]);
          }
          else {
            return d3.max([scale_y(focus_y_lower),scale_y.range()[1]]);
          }
        }
      }) 
      .text(function () {
        if (focus_y < 0 || facets == 'on') {
          return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
        }
        else {
          return scale_y.domain()[1] < 1000 ? d3.max([focus_y_lower,scale_y.domain()[0]]) : thousand_format(d3.max([focus_y_lower,scale_y.domain()[0]])).replace(/G/,"B");
        }
      });

      focus_update.select('#focus_y_max')
      .attr('x', 0)
      .attr('y', function () {
        if (focus_y < 0) {
          return facets == 'on' ? (chart_dim - facet_dim) : scale_y(scale_y.domain()[1]);
        }
        else {
          if (facets == 'on') {
            return d3.min([chart_dim - facet_dim,focus_y * facet_dim]);
          }
          else {
            return d3.min([scale_y(focus_y_upper),scale_y.range()[0]]);
          }
        }
      }) 
      .text(function () {
        if (focus_y < 0 || facets == 'on') {
          return scale_y.domain()[1] < 1000 ? scale_y.domain()[1]: thousand_format(scale_y.domain()[1]).replace(/G/,"B");
        }
        else {
          return scale_y.domain()[1] < 1000 ? d3.min([focus_y_upper,scale_y.domain()[1]]): thousand_format(d3.min([focus_y_upper,scale_y.domain()[1]])).replace(/G/,"B");
        }
      }); 

      focus_update.select('#focus_rect_x')
      .attr('x',focus_x * facet_dim)
      .attr("width",facet_dim)
      .attr('height', chart_dim);

      focus_update.select('#focus_rect_y')
      .attr('y',focus_y * facet_dim)
      .attr("width",chart_dim)
      .attr('height',facet_dim);
     
      /**
        
        HELPER FUNCTIONS
        
      **/

      var bisect = d3.bisector(function(d){
        return d[0];
      });

      function interpolateData(year) {
        return data.map(function (d){
          var tmp = {};
            tmp[params.key] = d[params.key];
            tmp[params.facet] = d[params.facet];
            tmp[params.color] = d[params.color];
            tmp[params.x] = (interpolateValues(d[params.x], year) != null) ? interpolateValues(d[params.x], year) : x_min;
            tmp[params.radius] = (interpolateValues(d[params.radius], year) != null) ? interpolateValues(d[params.radius], year) : 0;
            tmp[params.y] = (interpolateValues(d[params.y], year) != null) ? interpolateValues(d[params.y], year) : y_min;
            return tmp;
        });
      }

      // Finds (and possibly interpolates) the value for the specified year.
      function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
      }      

      function order(a, b) {
        return b[params.radius] - a[params.radius];
      }

      // Positions the marks based on data.
      function position(mark) {        

        var mark_transition;
        
        if (animation == 'off' && tilt == 'off' && !touching){
          mark_transition = mark.transition()
          .delay(function(d,i){
            return i * 10;
          })
          .duration(500);
        }
        else if (animation == 'on' && tilt == 'off'){
          mark_transition = mark.transition()         
          .delay(function(d,i){
            return i * (50 / data.length);
          })
          .duration(50);
        }
        else {
          mark_transition = mark;
        }

        mark_transition.select('circle')
        .attr("cx", function (d) {         
          return (d[params.x] != null) ? scale_x(d[params.x]) : - facet_dim;
        })        
        .style("stroke", function(d){
          if (facets == 'on') {
            return '#999';
          }
          else if (bubbleset_points.indexOf(d[params.key]) != -1) {
            return 'gold';
          }          
          else {
            return '#fff';
          }
        })
        .style("opacity", function(d){   

          if ((focus_x < 0 || focus_x > (num_facet_cols - 1)) && (focus_y_facet < 0 || focus_y_facet > (num_facet_cols - 1))) {
            if (facets == 'off' && bubbleset_points.length != 0) {
              if (bubbleset_points.indexOf(d[params.key]) != -1) {
                d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
                d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
                if (!non_interactive) {
                  d3.select('#' + d[params.key] + '_bttn').style('display',null);
                }
                if (highlight_points.indexOf(d[params.key]) == -1){
                  highlight_points.push(d[params.key]);
                }
                return 0.75;
              }
              else {
                d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.175);
                d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
                if (!non_interactive) {
                  d3.select('#' + d[params.key] + '_bttn').style('display','none');
                }
                if (highlight_points.indexOf(d[params.key]) != -1){
                  highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                }
                return 0.175;
              }
            }
            else {
              d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
              if (!non_interactive) {
                d3.select('#' + d[params.key] + '_bttn').style('display','none');
              }
              if (highlight_points.indexOf(d[params.key]) != -1){
                highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
              }
              d3.select('#line_' + d[params.key]).select('path').style('opacity', facets == 'on' ? 1 : 0.5);            
              return (facets == 'on' ? 1 : 0.5);
            }
          }
          else {
            if (facets == 'on') {
              d3.select('#line_'+ d[params.key]).select('path').style('opacity',1);
              d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
              if (!non_interactive) {
                d3.select('#' + d[params.key] + '_bttn').style('display',null);
              }
              if (highlight_points.indexOf(d[params.key]) != -1){
                highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
              }
              return 1;              
            }
            else {
              if (bubbleset_points.indexOf(d[params.key]) != -1) {
                d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
                d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
                if (!non_interactive) {
                  d3.select('#' + d[params.key] + '_bttn').style('display',null);
                }
                if (highlight_points.indexOf(d[params.key]) == -1){
                  highlight_points.push(d[params.key]);
                }
                return 0.75;
              }
              else if ((d[params.y] >= focus_y_lower && d[params.y] < focus_y_upper) || (d[params.x] >= focus_x_lower && d[params.x] < focus_x_upper)) {
                d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
                d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
                if (!non_interactive) {
                  d3.select('#' + d[params.key] + '_bttn').style('display',null);
                }
                if (highlight_points.indexOf(d[params.key]) == -1){
                  highlight_points.push(d[params.key]);
                }
                return 0.75;
              }
              else {
                d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.175);
                d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
                if (!non_interactive) {
                  d3.select('#' + d[params.key] + '_bttn').style('display','none');
                }
                if (highlight_points.indexOf(d[params.key]) != -1){
                  highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                }
                return 0.175;
              }
            }            
          }
        })
        .attr("cy", function (d) {
          return d[params.y] != null ? scale_y(d[params.y]) : - facet_dim;
        })
        .attr("r", function (d) {
          return (d[params.y] != null && d[params.x] != null) ? scale_pop(Math.sqrt(d[params.radius])) : 0;
        })
        .attr('transform', function (d) {
          if (facets == 'on') {
            return 'translate(' + (facet_dim * (d[params.facet] % num_facet_cols)) + ',' + (facet_dim * Math.floor(d[params.facet] / num_facet_cols)) + ')';
          }
          else {
            return 'translate(0,0)';
          }
        }); 
        
        mark_transition.select('text')
        .attr("x", function (d) {         
          return facets == 'on' ? 0 : ((d[params.x] != null) ? scale_x(d[params.x]) : - facet_dim);
        })
        .attr("dy", facets == "on" ? '-1em' : '0em')        
        // .style('visibility', function(d){
        //   if (facets == 'on') {
        //     return 'visible';
        //   }
        //   else if (d[params.y] != null && d[params.x] != null){
        //     return 'visible';
        //   }
        //   else {
        //     return 'hidden';
        //   }
        // })
        // .style("display", function(d){          
        //   if (non_interactive) {
        //     return null;
        //   }
        //   else if (bubbleset_points.indexOf(d[params.key]) != -1) {
        //     return null;
        //   }
        //   else if ((focus_x < 0 || focus_x > (num_facet_cols - 1)) && (focus_y_facet < 0 || focus_y_facet > (num_facet_cols - 1))) {            
        //     return facets == 'on' ? null : 'none';
        //   }
        //   else {
        //     if (facets == 'on') {
        //       if (d[params.facet] % num_facet_cols == focus_x || Math.floor(d[params.facet] / num_facet_cols) == focus_y) {
        //         return null;
        //       }
        //       else {
        //         return 'none';
        //       }
        //     }
        //     else {
        //       if ((d[params.y] >= focus_y_lower && d[params.y] < focus_y_upper) || (d[params.x] >= focus_x_lower && d[params.x] < focus_x_upper)) {
        //         return null;
        //       }
        //       else {
        //         return 'none';
        //       }
        //     }            
        //   }
        // })
        .attr("y", function (d) {
          return facets == 'on' ? 0 : (d[params.y] != null ? scale_y(d[params.y]) : - facet_dim);
        })
        .attr('transform', function (d) {
          if (facets == 'on') {
            return 'translate(' + (facet_dim * (d[params.facet] % num_facet_cols) + facet_dim * 0.5) + ',' + (facet_dim * Math.floor(d[params.facet] / num_facet_cols) + facet_dim) + ')';
          }
          else {
            return 'translate(0,0)';
          }
        });        
      }

      function redrawPolygon(polygon) {

        var polygon_transition;
        
        if (animation == 'off' && tilt == 'off'){
          polygon_transition = polygon.transition()
          .delay(function(d,i){
            return i * 10;
          })
          .duration(500);
        }
        else if (animation == 'on' && tilt == 'off'){
          polygon_transition = polygon.transition()     
          .delay(function(d,i){
            return i * (50 / data.length);
          })     
          .duration(50);
        }
        else {
          polygon_transition = polygon;
        }

        polygon_transition.attr("d", function(d) { 
          if (facets == 'on') {
            return null;
          }
          else {
            return d ? "M" + d.join("L") + "Z" : null; 
          }
        });
      }

      function tweenYear() {
        var year = d3.interpolateNumber(params.yearMin,params.yearMax);
        var counter = 0;
        return function (t) {
          now = new Date();
          if (counter != Math.floor((t * animation_duration) / 100)) {
            displayYear(year(t));
          } 
          counter = Math.floor((t * animation_duration) / 100);
        };
      }

      function tweenCurrentYear() {
        var year = d3.interpolateNumber(current_year,params.yearMax);
        var counter = 0;
        return function (t) {
          now = new Date();
          if (counter != Math.floor((t * animation_duration) / 100)) {
            displayYear(year(t));
          } 
          counter = Math.floor((t * animation_duration) / 100);
        };
      }

      function displayYear(year) {        
       
        var progress =  ((year + 1) - params.yearMin) / ((params.yearMax + 1) - params.yearMin);
        if (globals.outer_progress_circle != undefined) {
          d3.select('#outer_progress_value').attr('d', globals.outer_progress_circle.endAngle((Math.PI * 2) * (loop_count + progress)));
        }
        
        current_year = year;
        circle_marks.data(interpolateData(year), function(d){
          return d[params.key];
        })
        .call(position)
        .sort(order);

        voronoi_cells.data(function(){
          var arr = interpolateData(year);
          var tmp = voronoi.polygons(arr);   
          for (var i = 0; i < tmp.length; i++) {
            if (tmp[i] == undefined){
              tmp[i] = [[0,0],[0,0],[0,0],[0,0]];
              tmp[i].data = arr[i];
            }
          }     
          return tmp;       
        })
        .call(redrawPolygon);

        /** 
         * 
         * BUBBLESET + ANNOTATIONS 
         * 
        **/
      
        if (!non_interactive) {       
          
          var active_caption = false;
                    
          annotationList.forEach(function(d,i){
            if (d.x == params.x && d.y == params.y && current_year >= d.yearStart && current_year <= d.yearEnd) {
              if (d.caption != caption_text) {
                caption_text = d.caption;
                annotation_points = d.annotation_points;
                annotation_points.forEach(function(b){
                  if (bubbleset_points.indexOf(b) == -1) {
                    bubbleset_points.push(b);        
                    d3.select('#carousel_item_' + b).select('rect')
                    .style('stroke','gold');      
                  }
                });    
              }
              active_caption = true;                        
            }            
            if (i == annotationList.length - 1 && !active_caption) {
              caption_text = '';
              annotation_points.forEach(function(b){
                bubbleset_points.splice(bubbleset_points.indexOf(b),1);       
                d3.select('#carousel_item_' + b).select('rect')
                .style('stroke','#fff');         
              });
              annotation_points = [];
              active_caption = false;
            }
               
          });

          if (caption_text != "") {
            d3.select('#annotation_div').select('.annotation')
            .html(caption_text);    
            
            d3.select('#annotation_div').style('display',null);
            d3.selectAll('.carousel_item').style('display','none');       
            d3.selectAll('.carousel_clutch').style('display','none');
          }
          else {
            d3.select('#annotation_div').style('display','none');    
          }

          // console.log({
          //   'bubbleset_points': bubbleset_points,
          //   'outside_points': outside_points
          // });

          var bubbleset_update = bubbleset.transition()
          // .delay(data.length * 10)
          .ease(animation == 'on' ? d3.easeLinear : d3.easeElastic) 
          .duration(animation == 'on' ? 100 : (tilt == 'on' ? 0 : 500 + data.length * 10));

          bubbleset_coords = [];
          // outside_coords = [];
          bubble_node = -1;

          var bubble_x = 0,
              bubble_y = 0,
              bubble_r = 0,
              k = 0;

              
          for (var i = 0; i < bubbleset_points.length; i++) {
            bubble_code = bubbleset_points[i];
            
            k = 0;
            bubble_node = -1;
            
            while(k < data.length && bubble_node == -1) {
              if(data[k].code == bubble_code) {
                bubble_node = k;
              }
              k++;
            }          
                
            bubble_x = scale_x(interpolateValues(data[bubble_node][params.x],current_year));
            bubble_y = scale_y(interpolateValues(data[bubble_node][params.y],current_year));
            bubble_r = scale_pop(Math.sqrt(interpolateValues(data[bubble_node][params.radius],current_year)));

            bubbleset_coords.push({
              x: bubble_x - bubble_r,
              y: bubble_y - bubble_r,
              width: 2 * bubble_r,
              height: 2 * bubble_r,
            });
          }

          // for (var j = 0; j < outside_points.length; j++) {
          //   bubble_code = outside_points[j];
          //   bubble_node = d3.select('#mark_' + bubble_code);
          //   outside_coords.push({
          //     x: bubble_node.select('circle').attr('cx') - bubble_node.select('circle').attr('r'),
          //     y: bubble_node.select('circle').attr('cy') - bubble_node.select('circle').attr('r'),
          //     width: 2 * bubble_node.select('circle').attr('r'),
          //     height: 2 * bubble_node.select('circle').attr('r'),
          //   });
          //   k = 0;
          //   bubble_node = -1;

          //   while(k < data.length && bubble_node == -1) {
          //     if(data[k].code == bubble_code) {
          //       bubble_node = k;
          //     }
          //     k++;
          //   }
            
          //   bubble_x = scale_x(interpolateValues(data[bubble_node][params.x],current_year));
          //   bubble_y = scale_y(interpolateValues(data[bubble_node][params.y],current_year));
          //   bubble_r = scale_pop(Math.sqrt(interpolateValues(data[bubble_node][params.radius],current_year)));

          //   outside_coords.push({
          //     x: bubble_x - bubble_r,
          //     y: bubble_y - bubble_r,
          //     width: 2 * bubble_r,
          //     height: 2 * bubble_r,
          //   });
          // }

          // console.log({
          //   'bubbleset_coords': bubbleset_coords,
          //   'outside_coords': outside_coords
          // });

          var bubbleset_list = bubbles.createOutline(
            BubbleSet.addPadding(bubbleset_coords,bubbleset_pad),
            BubbleSet.addPadding(outside_coords,bubbleset_pad),
            null
          );

          var old_bubbleset_outline = bubbleset_outline.toString();

          bubbleset_outline = new PointPath(bubbleset_list).transform([
            new ShapeSimplifier(0.0),
            new BSplineShapeGenerator(),
            new ShapeSimplifier(0.0),
          ]);

          bubbleset_outline = bubbleset_outline.toString();

          var interpolator = flubber.interpolate(old_bubbleset_outline, bubbleset_outline);

          bubbleset_update.style("visibility", (facets == 'off') ? 'visible' : 'hidden')
          .attrTween('d', function(){ return interpolator; });

          for (var h = 0; h < bubbleset_points.length; h++){
            var node = document.getElementById('mark_' + bubbleset_points[h]);
            node.parentElement.appendChild(node);
          }

          bubbleset.exit()
          .remove();
        }
        
        
        d3.select('.year_indicator').text(facets == 'on' ? (params.yearMin + ' ― ' + params.yearMax) : Math.round(current_year));
        
      }

      var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { 
        return scale_x(d.param_x); 
      })
      .y(function(d) { 
        return scale_y(d.param_y); 
      });

      var voronoi = d3.voronoi()
      .x(function(d) { 
        return scale_x(d[params.x]); 
      })
      .y(function(d) { 
        return scale_y(d[params.y]); 
      })
      .extent([[0, 0], [chart_dim, chart_dim]]);

      function repeat() {
        if (animation == 'on') {            

          animation_duration = (params.yearMax - params.yearMin) * 500;
          this_chart.transition()
          .duration(animation_duration)
          .tween('year',tweenYear)
          .ease(d3.easeLinear)
          .on('end',function(){
            if (globals.trial_index > -1 && globals.num_selected == globals.trials[globals.trial_index].num_responses){
              d3.select('#progress_indicator').style('display','none');
              d3.select('#done_btn').attr('class','img_btn_enabled')
              .style('display',null)
              .attr('disabled',null)
              .attr('src', 'assets/done.svg');
            }
            else {
              d3.select('#submit_btn').attr('class','menu_btn_enabled')
              .attr('disabled',null);
            }
            loop_count++;
            if (!introduction_complete && globals.num_selected == 3) {              
              d3.select('#progress_indicator').style('display','none');
              d3.select('#done_btn').attr('class','img_btn_enabled')
              .style('display',null)
              .attr('disabled',null)
              .attr('src', 'assets/done.svg');
            }
            else {
              if (introduction_complete && loop_count > 0 && globals.num_selected == globals.trials[globals.trial_index].num_responses){
                d3.select('#done_btn').attr('class','img_btn_enabled')
                .attr('src', 'assets/done.svg');
              }
            }
            repeat();
          });
        }
        else {
          displayYear(current_year);
        }         
      }

      /**

      DATA ELEMENT ENTER

      **/

      // CIRCLES

      var circle_marks = this_chart.selectAll(".mark")
      .data(interpolateData(params.yearMin), function(d) {
        return d[params.key];
      });

      // VORONOI PATHS

      var voronoi_cells = this_chart.selectAll("path")
      .data(function(){
        var arr = interpolateData(params.yearMin);
        var tmp = voronoi.polygons(arr);   
        for (var i = 0; i < tmp.length; i++) {
          if (tmp[i] == undefined){
            tmp[i] = [[0,0],[0,0],[0,0],[0,0]];
            tmp[i].data = arr[i];
          }
        }     
        return tmp;
      });

      voronoi_cells.enter()
      .append('path')
      .attr("class", function(d) {         
        return "voronoi_" + d.data[params.key]; 
      })
      .style("stroke", non_interactive ? "transparent" : "#666") //If you want to look at the cells
      .style("opacity", 0.1) //If you want to look at the cells
      .style("stroke-dasharray", "0.2em")
      .style("fill", "none")
      .style("pointer-events", "all")      
      .on('touchstart', function(d){ 
        d3.event.preventDefault(); 
        touchdown(d.data[params.key]);
      }) 
      .on('touchend',touchend);  

      voronoi_cells.call(redrawPolygon);

      // FACETS

      var facet_bounds = this_chart.selectAll(".facet")
      .data(data, function(d) {
        return d[params.key];
      });

      var facet_bound_enter = facet_bounds.enter()
      .append("g")
      .attr("class","facet")
      .attr("id", function (d) {
        return "facet_" + d[params.key];
      });
  
      facet_bound_enter.append('rect')
      .attr("class","facet_rect")      
      .attr("id", function (d) {
        return "facet_" + d[params.key];
      })
      .style("fill", facets == 'on' ? 'transparent' : 'none')
      .attr('width', facet_dim)
      .attr('height', facet_dim)
      .style("stroke-dasharray", '0.1em')
      .style("stroke", facets == 'on' ? '#666' : 'none')
      .attr('transform', function (d) {
        return 'translate(' + (facet_dim * (d[params.facet] % num_facet_cols)) + ',' + (facet_dim * Math.floor(d[params.facet] / num_facet_cols)) + ')';
      })
      .attr('rx', 5)
      .on('touchstart', function(d){ 
        if (facets == 'on') {
          d3.event.preventDefault(); 
          touchdown(d[params.key]);
        }
      }) 
      .on('touchend',touchend);       

      // LINES
            
      var line_marks = this_chart.selectAll(".line")
      .data(countries, function(d) {
        return d.id;
      });

      var line_mark_enter = line_marks.enter()
      .append("g")
      .attr("class","line")
      .attr("id", function (d) {
        return "line_" + d.id;
      });
  
      line_mark_enter.append('path')
      .attr("class","path_line")      
      .style("stroke", function (d) {
        return lines == 'on' ? scale_reg(d[params.color]) : 'transparent';
      })
      .style('fill','none')
      .attr("d", function(d) { 
        var tmp = d.values;           
        return line(tmp); 
      })
      .style("opacity", function(){
        if (facets == 'on') {
          return 1;
        }
        else {
          return 0.5;
        }
      })
      .attr('transform', function (d) {
        if (facets == 'on') {
          return 'translate(' + (facet_dim * (d[params.facet] % num_facet_cols)) + ',' + (facet_dim * Math.floor(d[params.facet] / num_facet_cols)) + ')';
        }
        else {
          return 'translate(0,0)';
        }
      });   
      
      //CIRCLE ENTER
      
      var circle_mark_enter = circle_marks.enter()
      .append("g")
      .attr("class","mark")
      .attr("id", function (d) {
        return "mark_" + d[params.key];
      });

      circle_mark_enter.append('circle')
      .attr("class", function (d) {
        return "circle_mark_" + d[params.key];
      })   
      .style("opacity", function(d){
        if (bubbleset_points.indexOf(d[params.key]) != -1) {
          return 0.75;
        }
        else if (facets == 'on') {
          return 1;
        }
        else {
          return 0.5;
        }
      })
      .style("stroke", function(d){
        if (facets == 'on') {
          return '#999';
        }
        else if (bubbleset_points.indexOf(d[params.key]) != -1) {
          return 'gold';
        }       
        else {
          return '#fff';
        }
      })
      .style("fill", function (d) {       
        return scale_reg(d[params.color]);
      });

      circle_mark_enter.append('text')
      .attr("class", 'text_mark')
      .attr('text-anchor', "middle")
      .attr('alignment-baseline','middle')
      .attr('id', function(d){
        return "text_mark_" + d[params.key];
      })
      .style('display',non_interactive ? null : null)
      .text(function(d){
        return d[params.key];
      });

      circle_marks.call(position)
      .sort(order);  
      
      /**

      DATA ELEMENT UPDATE 

      **/

      repeat();    
      
      var facet_bound_update = facet_bounds.transition()
      .delay(function(d,i){
        return i * 10;
      })
      .duration(500);
      
      facet_bound_update.selectAll('rect.facet_rect')
      .style("stroke", function(d){
        return facets == 'on' ? (bubbleset_points.indexOf(d[params.key]) != -1 ? 'gold ' : '#999') : 'none';              
      }) 
      .style("fill", facets == 'on' ? 'transparent' : 'none')
      .attr('transform', function (d) {
        return 'translate(' + (facet_dim * (d[params.facet] % num_facet_cols)) + ',' + (facet_dim * Math.floor(d[params.facet] / num_facet_cols)) + ')';
      });

      var line_mark_update = line_marks.transition()
      .delay(function(d,i){
        return i * 10;
      })
      .duration(500);

      line_mark_update.selectAll('path.path_line')
      .style("stroke", function (d) {
        return lines == 'on' ? scale_reg(d[params.color]) : 'transparent';
      })
      .attr("d", function(d) { 
        var tmp = d.values;   
        // for (var i = 0; i < tmp.length; i++) {
        //   if (tmp[i].param_x == null || tmp[i].param_y == null){
        //     tmp.splice(i,1);
        //   }
        // }
        // console.log(tmp);
        return line(tmp); 
      })
      .attr('transform', function (d) {
        if (facets == 'on') {
          return 'translate(' + (facet_dim * (d[params.facet] % num_facet_cols)) + ',' + (facet_dim * Math.floor(d[params.facet] / num_facet_cols)) + ')';
        }
        else {
          return 'translate(0,0)';
        }
      }); 
      
      /**

      DATA ELEMENT EXIT

      **/

      circle_marks.exit()      
      .remove();

      line_marks.exit()
      .remove();

      facet_bounds.exit()
      .remove();  
      
      
      /** 
      
      VORONOI / FACET INTERACTION 
      
      **/

      function touchdown(d) {       
        d3.event.preventDefault();
        d3.event.stopPropagation();      
        d3.selectAll('circle')
        .style('opacity',0.2);

        d3.selectAll('.path_line')
        .style('opacity',0.2);

        d3.selectAll('.facet_rect')
        .style('opacity',0.2);

        d3.select('.circle_mark_'+d)
        .style('opacity',1);

        d3.select('#facet_'+d)
        .style('opacity',1);

        d3.select('#line_'+d).select('path')
        .style('opacity',1);
      }

      function touchend() {      
        d3.event.preventDefault();
        d3.event.stopPropagation();
        d3.selectAll('circle')
        .style('opacity', function(){
          if (facets == 'on') {
            return 1;
          }
          else {
            return 0.5;
          }
        });

        d3.selectAll('.facet_rect')
        .style('opacity',1);

        d3.selectAll('.path_line')
        .style("opacity", function(d){
          if (bubbleset_points.indexOf(d[params.key]) != -1) {
            return 0.75;
          }
          else if (facets == 'on') {
            return 1;
          }
          else {
            return 0.5;
          }
        });
      }

      /** 
       * 
       * OVERLAY INTERACTION 
       * 
      **/

      d3.selectAll('.overlay').remove();
      
      this_chart.append('rect')
      .attr('class','overlay')
      .attr('id','y_indicator_overlay')
      .attr('width',inner_padding)
      .attr('height',chart_dim)
      .attr('x',0 - inner_padding)
      .attr('y',0)
      .on('touchstart',non_interactive ? null : y_selector);          

      function y_selector() {

        d3.event.preventDefault();
        touching = true;

        d3.select('.y_indicator').select('.indicator_text')
        .transition()
        .duration(100)
        .ease(d3.easeCubic)
        .style('fill','#fff')
        .transition()
        .duration(250)
        .ease(d3.easeCubic)
        .style('fill','gold');

        d3.select('#y_picker').remove();
        d3.select('#x_picker').remove();

        var param_list = [
          "Population",
          "Arable Area",
          "Energy Consumption",
          "GDP Per Capita",
          "Life Expectancy (Women)",
          "Life Expectancy (Men)",
          "Life Expectancy",
          "Infant Mortality",
          "Number of Personal Computers",
          "G Index",
          "E Index",
          "P Index"
        ];

        hideCarousel();

        d3.select('#sandbox_div').append("select")
        .attr('id','y_picker')
        .style('position','absolute')
        .style('top',((svg_dim * 0.5) - 20) + 'px')
        .style('left',(svg_dim * 0.1) + 'px')
        .style('width',(svg_dim * 0.8) + 'px')
        .attr('class','menu_select_enabled')  
        .on('change', function() {
          if (globals.param_x == d3.select(this).property('value')){
            d3.select(this).property('value', globals.param_y);
            alert('y != x');
          }
          else {
            touching = false;
            globals.param_y = d3.select(this).property('value');
            chart_instance.params().y = d3.select(this).property('value');
            d3.select(this).remove();
            chart_g.call(chart_instance);             
            hideAddressBar();
          }
        })
        .selectAll('option')
        .data(param_list)
        .enter()
        .append('option')
        .attr("value", function (d) { return d; })
        .text(function (d) { return 'y: ' + d; })
        .property("selected", function (d) {
          return d === globals.param_y;
        });

      }

      this_chart.append('rect')
      .attr('class','overlay')
      .attr('id','x_indicator_overlay')
      .attr('width',chart_dim)
      .attr('height',inner_padding)
      .attr('x',0)
      .attr('y',chart_dim)
      .on('touchstart',non_interactive ? null : x_selector);       

      function x_selector() {

        d3.event.preventDefault();
        touching = true;

        d3.select('.x_indicator').select('.indicator_text')
        .transition()
        .duration(100)
        .ease(d3.easeCubic)
        .style('fill','#fff')
        .transition()
        .duration(250)
        .ease(d3.easeCubic)
        .style('fill','gold');

        d3.select('#y_picker').remove();
        d3.select('#x_picker').remove();

        var param_list = [
          "Population",
          "Arable Area",
          "Energy Consumption",
          "GDP Per Capita",
          "Life Expectancy (Women)",
          "Life Expectancy (Men)",
          "Life Expectancy",
          "Infant Mortality",
          "Number of Personal Computers",
          "G Index",
          "E Index",
          "P Index"
        ];

        hideCarousel();

        d3.select('#sandbox_div').append("select")
        .attr('id','x_picker')
        .style('position','absolute')
        .style('top',((svg_dim * 0.5) - 20) + 'px')
        .style('left',(svg_dim * 0.1) + 'px')
        .style('width',(svg_dim * 0.8) + 'px')
        .attr('class','menu_select_enabled')  
        .on('change', function() {
          if (globals.param_y == d3.select(this).property('value')){
            d3.select(this).property('value', globals.param_x);
            alert('x != y');
          }
          else {
            touching = false;
            globals.param_x = d3.select(this).property('value');
            chart_instance.params().x = d3.select(this).property('value');
            d3.select(this).remove();
            chart_g.call(chart_instance);             
            hideAddressBar();
          }
        })
        .selectAll('option')
        .data(param_list)
        .enter()
        .append('option')
        .attr("value", function (d) { return d; })
        .text(function (d) { return 'x: ' + d; })
        .property("selected", function (d) {
          return d === globals.param_x;
        });

      }
      
      this_chart.append('rect')
      .attr('class','overlay')
      .attr('width',chart_dim + inner_padding)
      .attr('height',chart_dim + inner_padding)
      .attr('x',0)
      .attr('y',0 - inner_padding)
      .on('touchstart',non_interactive ? null : overlay_touchdown)  
      .on('touchmove',non_interactive ? null : bubbleset_touchmove)
      .on('touchend',non_interactive ? null : overlay_touchend);    

      function overlay_touchdown() {        
        
        d3.event.preventDefault();
        d3.event.stopPropagation();
        touching = true;
        var d = d3.touches(this);
        var x = d[0][0];
        var y = d[0][1];

        d3.select('#y_picker').remove();
        d3.select('#x_picker').remove();        

        circlefit.resetPoints();
        touch_points = [];

        last_touch = new Date();
        touch_counter = 0;

        var touch_point = {
          'x': x,
          'y': y
        };  

        touch_points.push(touch_point);

        scroll_year = current_year;               

        if (animation == 'on') {
          this_chart.interrupt();
        }
        
        d3.select('#focus_rect_x').style('display',null);
        d3.select('#focus_rect_y').style('display',null);

        focus_x = Math.floor(x / facet_dim);
        focus_y = Math.floor(y / facet_dim);

        if (focus_x > (num_facet_cols - 1) || focus_x < 0) {
          focus_x = -1;
        }

        if (focus_y > (num_facet_cols - 1) || focus_y < 0) {
          focus_y = -1;
        }

        focus_x_lower = facets == 'on' ? scale_x.domain()[0] : Math.floor(scale_x.invert(focus_x * facet_dim));      
        focus_x_upper = facets == 'on' ? scale_x.domain()[1] : Math.ceil(scale_x.invert((focus_x + 1) * facet_dim));

        focus_y_lower = facets == 'on' ? scale_y.domain()[0] : Math.floor(scale_y.invert((focus_y + 1) * facet_dim));
        focus_y_upper = facets == 'on' ? scale_y.domain()[1] : Math.ceil(scale_y.invert(focus_y * facet_dim));      
        focus_y_facet = (num_facet_cols - 1) - focus_y;        
        
        // console.log({
        //   "type":"touch",
        //   "focus_x":focus_x,
        //   "focus_y":focus_y,
        //   "focus_x_lower": focus_x_lower,
        //   "focus_x_upper": focus_x_upper,
        //   "focus_y_lower": focus_y_lower,
        //   "focus_y_upper": focus_y_upper
        // });

        d3.selectAll('.mark').select('circle')
        .style('opacity',function(d){
          if (facets == 'on') {
            if (focus_x < 0 || focus_x > (num_facet_cols - 1)) { //focus_x invalid
              if (focus_y < 0 || focus_y > (num_facet_cols - 1)) { //focus_x and focus_y invalid

                d3.select('#focus_x_min')
                .attr('x', 0)
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[0] : thousand_format(scale_x.domain()[0]).replace(/G/,"B");
                });

                d3.select('#focus_x_max')
                .attr('x', scale_x(scale_x.domain()[1]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[1] : thousand_format(scale_x.domain()[1]).replace(/G/,"B");
                }); 

                d3.select('#focus_y_min')
                .attr('x', 0)
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
                });

                d3.select('#focus_y_max')
                .attr('x', 0)
                .attr('y', chart_dim - facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[1] : thousand_format(scale_y.domain()[1]).replace(/G/,"B");
                });
               
              }
              else { // focus_y valid

                d3.select('#focus_y_min')
                .attr('x', 0)
                .attr('y', (focus_y + 1) * facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
                });
          
                d3.select('#focus_y_max')
                .attr('x', 0)
                .attr('y', (focus_y) * facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[1] : thousand_format(scale_y.domain()[1]).replace(/G/,"B");
                });

                d3.select('#focus_x_min')
                .attr('x', scale_x(scale_x.domain()[0]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[0] : thousand_format(scale_x.domain()[0]).replace(/G/,"B");
                });

                d3.select('#focus_x_max')
                .attr('x', scale_x(scale_x.domain()[1]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[1] : thousand_format(scale_x.domain()[1]).replace(/G/,"B");
                }); 
                
              }
            }
            else { //focus_x valid

              d3.select('#focus_x_min')
              .attr('x', focus_x * facet_dim)
              .attr('y', chart_dim)
              .text(function() { 
                return scale_x.domain()[1] < 1000 ? scale_x.domain()[0] : thousand_format(scale_x.domain()[0]).replace(/G/,"B");
              });

              d3.select('#focus_x_max')
              .attr('x', (focus_x + 1) * facet_dim)
              .attr('y', chart_dim)
              .text(function() { 
                return scale_x.domain()[1] < 1000 ? scale_x.domain()[1] : thousand_format(scale_x.domain()[1]).replace(/G/,"B");
              });

              d3.select('#focus_y_min')
              .attr('x', 0)
              .attr('y', chart_dim)
              .text(function() { 
                return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
              });

              d3.select('#focus_y_max')
              .attr('x', 0)
              .attr('y', chart_dim - facet_dim)
              .text(function() { 
                return scale_y.domain()[1] < 1000 ? scale_y.domain()[1] : thousand_format(scale_y.domain()[1]).replace(/G/,"B");
              });

              if (focus_y < 0 || focus_y > (num_facet_cols - 1)) { //focus_y invalid
                //do nothing
              }
              else { //focus_x and focus_y valid 

                d3.select('#focus_y_min')
                .attr('x', 0)
                .attr('y', (focus_y + 1) * facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
                });
          
                d3.select('#focus_y_max')
                .attr('x', 0)
                .attr('y', (focus_y) * facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[1] : thousand_format(scale_y.domain()[1]).replace(/G/,"B");
                });
               
              }
            }
            d3.selectAll('.line').select('path').style('opacity',1);
            d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
            if (!non_interactive) {
              d3.select('#' + d[params.key] + '_bttn').style('display',null);
            }
            if (highlight_points.indexOf(d[params.key]) != -1){
              highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
            }
            return 1;          
          }
          else { // facets off!
            if (bubbleset_points.indexOf(d[params.key]) != -1) {
              d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
              d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
              if (!non_interactive) {
                d3.select('#' + d[params.key] + '_bttn').style('display',null);
              }
              if (highlight_points.indexOf(d[params.key]) == -1){
                highlight_points.push(d[params.key]);
              }
              return 0.75;
            }
            else if (focus_x < 0 || focus_x > (num_facet_cols - 1)) { //focus_x invalid
              if (focus_y < 0 || focus_y > (num_facet_cols - 1)) { //focus_x and focus_y invalid

                d3.select('#focus_x_min')
                .attr('x', scale_x(scale_x.domain()[0]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[0] : thousand_format(scale_x.domain()[0]).replace(/G/,"B");
                });

                d3.select('#focus_x_max')
                .attr('x', scale_x(scale_x.domain()[1]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[1] :  thousand_format(scale_x.domain()[1]).replace(/G/,"B");
                }); 

                d3.select('#focus_y_min')
                .attr('x', 0)
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
                });

                d3.select('#focus_y_max')
                .attr('x', 0)
                .attr('y', scale_y(scale_y.domain()[1]))
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? scale_y.domain()[1] : thousand_format(scale_y.domain()[1]).replace(/G/,"B");
                });

                d3.selectAll('.text_mark').attr("class", function(d) {
                  if (bubbleset_points.indexOf(d[params.key]) != -1) {
                    if (highlight_points.indexOf(d[params.key]) == -1){
                      highlight_points.push(d[params.key]);
                    }
                    if (!non_interactive) {
                      d3.select('#' + d[params.key] + '_bttn').style('display',null);
                    }
                    return 'text_mark_highlighted';
                  }
                  else {
                    if (highlight_points.indexOf(d[params.key]) != -1){
                      highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                    }
                    if (!non_interactive) {
                      d3.select('#' + d[params.key] + '_bttn').style('display','none');
                    }
                    return 'text_mark';
                  }
                });

                d3.selectAll('.text_mark_highlighted').attr("class", function(d) {
                  if (bubbleset_points.indexOf(d[params.key]) != -1) {
                    if (highlight_points.indexOf(d[params.key]) == -1){
                      highlight_points.push(d[params.key]);
                    }
                    if (!non_interactive) {
                      d3.select('#' + d[params.key] + '_bttn').style('display',null);
                    }
                    return 'text_mark_highlighted';
                  }
                  else {
                    if (highlight_points.indexOf(d[params.key]) != -1){
                      highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                    }
                    if (!non_interactive) {
                      d3.select('#' + d[params.key] + '_bttn').style('display','none');
                    }
                    return 'text_mark';
                  }
                });

                d3.selectAll('.line').select('path').style('opacity',function(d){
                  if (bubbleset_points.length == 0) {
                    return 0.5;
                  } 
                  else {
                    return bubbleset_points.indexOf(d[params.key]) != -1 ? 0.75 : 0.175;
                  }
                });
                // d3.selectAll('.text_mark').style('display','none');
                if (bubbleset_points.length == 0) {
                  return 0.5;
                } 
                else {
                  return bubbleset_points.indexOf(d[params.key]) != -1 ? 0.75 : 0.175;
                }
              }
              else { // focus_y valid

                d3.select('#focus_y_min')
                .attr('x', 0)
                .attr('y', (focus_y + 1) * facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? focus_y_lower : thousand_format(focus_y_lower).replace(/G/,"B");
                });
          
                d3.select('#focus_y_max')
                .attr('x', 0)
                .attr('y', (focus_y) * facet_dim)
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? focus_y_upper : thousand_format(focus_y_upper).replace(/G/,"B");
                });

                d3.select('#focus_x_min')
                .attr('x', scale_x(scale_x.domain()[0]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[0] : thousand_format(scale_x.domain()[0]).replace(/G/,"B");
                });

                d3.select('#focus_x_max')
                .attr('x', scale_x(scale_x.domain()[1]))
                .attr('y', chart_dim)
                .text(function() { 
                  return scale_x.domain()[1] < 1000 ? scale_x.domain()[1] : thousand_format(scale_x.domain()[1]).replace(/G/,"B");
                }); 

                if (d[params.y] >= focus_y_lower && d[params.y] < focus_y_upper) {
                  d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
                  d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
                  if (!non_interactive) {
                    d3.select('#' + d[params.key] + '_bttn').style('display',null);
                  }
                  if (highlight_points.indexOf(d[params.key]) == -1){
                    highlight_points.push(d[params.key]);
                  }
                  return 0.75;
                }
                else {
                  d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.175);
                  d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
                  if (!non_interactive) {
                    d3.select('#' + d[params.key] + '_bttn').style('display','none');
                  }
                  if (highlight_points.indexOf(d[params.key]) != -1){
                    highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                  }
                  return 0.175;
                }
              }
            }
            else { //focus_x valid

              d3.select('#focus_x_min')
              .attr('x', focus_x * facet_dim)
              .attr('y', chart_dim)
              .text(function() { 
                return scale_x.domain()[1] < 1000 ? focus_x_lower : thousand_format(focus_x_lower).replace(/G/,"B");
              });

              d3.select('#focus_x_max')
              .attr('x', (focus_x + 1) * facet_dim)
              .attr('y', chart_dim)
              .text(function() { 
                return scale_x.domain()[1] < 1000 ? focus_x_upper : thousand_format(focus_x_upper).replace(/G/,"B");
              });

              d3.select('#focus_y_min')
              .attr('x', 0)
              .attr('y', chart_dim)
              .text(function() { 
                return scale_y.domain()[1] < 1000 ? scale_y.domain()[0] : thousand_format(scale_y.domain()[0]).replace(/G/,"B");
              });

              d3.select('#focus_y_max')
              .attr('x', 0)
              .attr('y', scale_y(scale_y.domain()[1]))
              .text(function() { 
                return scale_y.domain()[1] < 1000 ? scale_y.domain()[1] : thousand_format(scale_y.domain()[1]).replace(/G/,"B");
              });

              if (focus_y < 0 || focus_y > (num_facet_cols - 1)) { //focus_y invalid
                if (d[params.x] >= focus_x_lower && d[params.x] < focus_x_upper) {
                  d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
                  d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
                  if (!non_interactive) {
                    d3.select('#' + d[params.key] + '_bttn').style('display',null);
                  }
                  if (highlight_points.indexOf(d[params.key]) == -1){
                    highlight_points.push(d[params.key]);
                  }
                  return 0.75;
                }
                else {
                  d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.175);
                  d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
                  if (!non_interactive) {
                    d3.select('#' + d[params.key] + '_bttn').style('display','none');
                  }
                  if (highlight_points.indexOf(d[params.key]) != -1){
                    highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                  }
                  return 0.175;
                }
              }
              else { //focus_x and focus_y valid 

                d3.select('#focus_y_min')
                .attr('x', 0)
                .attr('y', scale_y(focus_y_lower))
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? focus_y_lower : thousand_format(focus_y_lower).replace(/G/,"B");
                });
          
                d3.select('#focus_y_max')
                .attr('x', 0)
                .attr('y', scale_y(focus_y_upper))
                .text(function() { 
                  return scale_y.domain()[1] < 1000 ? focus_y_upper : thousand_format(focus_y_upper).replace(/G/,"B");
                });

                if ((d[params.y] >= focus_y_lower && d[params.y] < focus_y_upper) || (d[params.x] >= focus_x_lower && d[params.x] < focus_x_upper)) {
                  d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.75);
                  d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark_highlighted');
                  if (!non_interactive) {
                    d3.select('#' + d[params.key] + '_bttn').style('display',null);
                  }
                  if (highlight_points.indexOf(d[params.key]) == -1){
                    highlight_points.push(d[params.key]);
                  }
                  return 0.75;
                }
                else {
                  d3.select('#line_'+ d[params.key]).select('path').style('opacity',0.175);
                  d3.select('#text_mark_' + d[params.key]).attr("class", 'text_mark');
                  if (!non_interactive) {
                    d3.select('#' + d[params.key] + '_bttn').style('display','none');
                  }
                  if (highlight_points.indexOf(d[params.key]) != -1){
                    highlight_points.splice(highlight_points.indexOf(d[params.key]),1);
                  }
                  return 0.175;
                }
              }
            }
          }
        });

        d3.select('#focus_rect_x')
        .attr('x',focus_x * facet_dim)
        .style('display',(focus_x < 6 && focus_x > -1) ? null : 'none');

        d3.select('#focus_rect_y')
        .attr('y',focus_y * facet_dim)
        .style('display',(focus_y < 6 && focus_y > -1) ? null : 'none');

        updateCarousel();

      }

      function updateCarousel() {

        if (window.location.href.indexOf('mobubble') != -1) { 
          carousel_g.datum(highlight_points);
          carousel_instance.carousel_focus(Math.floor((highlight_points.length - 1) / 2));
          carousel_g.call(carousel_instance);
          setTimeout(function(){
            carousel_g.call(carousel_instance);
          }, 275);
          if (caption_text != "") {
            d3.select('#annotation_div').style('display',null);            
            d3.selectAll('.carousel_item').style('display','none');       
            d3.selectAll('.carousel_clutch').style('display','none');
          }
          else {
            d3.select('#annotation_div').style('display','none');            
            if (highlight_points.length > 0) {
              d3.selectAll('.carousel_item').style('display','inline');       
              d3.selectAll('.carousel_clutch').style('display','inline');             
            }
          }
        }
      }

      function hideCarousel() {
        d3.selectAll('.carousel_item').style('display','none');       
        if (highlight_points.length > 0 && caption_text == "") {
          d3.selectAll('.carousel_clutch').style('display','inline'); 
        }
        else {
          d3.selectAll('.carousel_clutch').style('display','none'); 
        }
      }

      function overlay_touchend() {
        
        touch_points = [];
        circlefit.resetPoints();    
        
        touching = false; 
        hideCarousel();
        
        d3.event.preventDefault();
        d3.event.stopPropagation();
        if (animation == 'on'){
          animation_duration = (params.yearMax - current_year) * 500;
          this_chart.transition()
          .duration(animation_duration)
          .tween('year',tweenCurrentYear)
          .ease(d3.easeLinear)
          .on('end',function(){
            loop_count++;
            if (!introduction_complete && globals.num_selected == 3) {              
              d3.select('#progress_indicator').style('display','none');
              d3.select('#done_btn').attr('class','img_btn_enabled')
              .style('display',null)
              .attr('disabled',null)
              .attr('src', 'assets/done.svg');
            }
            else {
              if (loop_count > 0 && globals.num_selected == globals.trials[globals.trial_index].num_responses){
                d3.select('#done_btn').attr('class','img_btn_enabled')
                .attr('src', 'assets/done.svg');
              }
            }
            repeat();
          });  
        }

      }

      /** 
       * 
       * BUBBLESET INTERACTION 
       * 
      **/
     
      if (!non_interactive) {        
          
        bubbleset.enter()
        .append("path")
        .attr("class", "bubbleset")
        .attr("id", "bubbleset")
        .attr('d',bubbleset_outline)
        .style('fill','transparent')
        .style("visibility", (facets == 'off') ? 'visible' : 'hidden')
        .on('touchstart',  bubbleset_touchstart)
        .on('touchmove', bubbleset_touchmove)
        .on('touchend', bubbleset_touchend);
        
        //append nodes inside bubbleset_points to front
        for (var i = 0; i < bubbleset_points.length; i++){
          node = document.getElementById('mark_' + bubbleset_points[i]);
          node.parentElement.appendChild(node);
        }
        
        //append bubbleset to front
        node = document.getElementById('bubbleset');
        node.parentElement.appendChild(node);               

      }

      function bubbleset_touchstart() {

        d3.select('#y_picker').remove();
        d3.select('#x_picker').remove();        

        d3.event.preventDefault();
        d3.event.stopPropagation();
        touching = true;
        if (animation == 'on') {
          this_chart.interrupt();
        }

        circlefit.resetPoints();
        touch_points = [];

        last_touch = new Date();
        touch_counter = 0;

        var d = d3.touches(this);
        var x = d[0][0];
        var y = d[0][1];
        var touch_point = {
          'x': x,
          'y': y
        };  

        touch_points.push(touch_point);

        scroll_year = current_year;
               
        // circlefit.addPoint(x, y);

        d3.select(this).style('fill', 'rgba(102,102,102,0.2)');
        var node = document.getElementById('bubbleset');
        node.parentElement.appendChild(node);   
        //append nodes inside bubbleset_points to front
        for (var i = 0; i < bubbleset_points.length; i++){
          node = document.getElementById('mark_' + bubbleset_points[i]);
          node.parentElement.appendChild(node);
        }
        updateCarousel();        
      }

      function bubbleset_touchmove() {

        
        d3.event.preventDefault();
        d3.event.stopPropagation();
        if (animation == 'on') {
          this_chart.interrupt();
        }
        touching = true;     
        hideCarousel();

        var now = new Date(); 

        if (last_touch != undefined) {
          if (now.getSeconds() != last_touch.getSeconds()) {
            last_touch = now;   
            touch_counter = 0;
          }    
        }
        else {
          last_touch = now; 
        }

        touch_counter++;
        
        circlefit.resetPoints();

        var d = d3.touches(this);
        var x = d[0][0];
        var y = d[0][1];
        var touch_point = {
          'x': x,
          'y': y
        };  

        var result = {
          'success': false 
        };

        // console.log(last_touch.getSeconds() + ":  <" + x + ',' + y + '>');
        touch_points.push(touch_point);
        if (touch_points.length > 30) {
          touch_points.splice(0,1);
          touch_points.forEach(function(point) {
            circlefit.addPoint(point.x, point.y);
          });
        }
        
        if (touch_counter % 3 == 0) {

          if (touch_points.length > 3){
            result = circlefit.compute();       
          }

          if (result.success) {
            var p1 = {
              'x': 0,
              'y': 0
            };          
            var p2 = {
              'x': result.projections[result.projections.length - 2].x - result.center.x,
              'y': result.projections[result.projections.length - 2].y - result.center.y
            };
            var p3 = {
              'x': result.projections[result.projections.length - 1].x - result.center.x,
              'y': result.projections[result.projections.length - 1].y - result.center.y
            };

            var angle = (Math.atan2(p3.y - p1.y, p3.x - p1.x) - Math.atan2(p2.y - p1.y, p2.x - p1.x)) *  180 / Math.PI;
            
            // console.log(result.projections);  
            // console.log({
            //   'p2': '<' + p2.x + ', ' + p2.y + '>',
            //   'p3': '<' + p3.x + ', ' + p3.y + '>',
            //   // 'radius': result.radius,
            //   // 'theta': theta,
            //   'angle': angle,
            //   'scroll': scale_scroll(angle)
            // });
            scroll_year = scroll_year + scale_scroll(angle);
            if (scroll_year < params.yearMin) {
              current_year = params.yearMin;
            }
            else if (scroll_year > params.yearMax) {
              current_year = params.yearMax;
            }
            else {
              current_year = scroll_year;
            }
            chart_g.call(chart_instance);    
          }
        }

      }
      
      function bubbleset_touchend() {
        
        d3.event.preventDefault();
        d3.event.stopPropagation();
        
        touch_points = [];
        circlefit.resetPoints();
        
        touching = false;     
        hideCarousel();
        d3.select(this).style('fill', 'transparent');
        var node = document.getElementById('bubbleset');
        node.parentElement.appendChild(node);   
       
        if (animation == 'on'){
          
          animation_duration = (params.yearMax - current_year) * 500;
          this_chart.transition()
          .duration(animation_duration)
          .tween('year',tweenCurrentYear)
          .ease(d3.easeLinear)
          .on('end',repeat);  
        }     
      }  
      
      if (facets == 'on') {
        highlight_points = [];
        d3.selectAll('.country_btn_enabled').style('display',null);
      }

    });
  }

  /**

  GETTER / SETTER FUNCTIONS

  **/  

  //getter / setter for showing lines
  chart.lines = function (x) {
    if (!arguments.length) {
      return lines;
    }
    lines = x;
    return chart;
  };

  //getter / setter for animation
  chart.animation = function (x) {
    if (!arguments.length) {
      return animation;
    }
    animation = x;
    return chart;
  };

  //getter / setter for facets
  chart.facets = function (x) {
    if (!arguments.length) {
      return facets;
    }
    facets = x;
    return chart;
  };

  //getter / setter for tilt
  chart.tilt = function (x) {
    if (!arguments.length) {
      return tilt;
    }
    tilt = x;
    return chart;
  };

  //getter / setter for current_year
  chart.current_year = function (x) {
    if (!arguments.length) {
      return current_year;
    }
    current_year = x;
    return chart;
  };
  
  //getter / setter for scale_pop
  chart.scale_pop = function (x) {
    if (!arguments.length) {
      return scale_pop;
    }
    scale_pop = x;
    return chart;
  };

  //getter / setter for scale_x
  chart.scale_x = function (x) {
    if (!arguments.length) {
      return scale_x;
    }
    scale_x = x;
    return chart;
  };

  //getter / setter for scale_y
  chart.scale_y = function (x) {
    if (!arguments.length) {
      return scale_y;
    }
    scale_y = x;
    return chart;
  };

  //getter / setter for scale_reg
  chart.scale_reg = function (x) {
    if (!arguments.length) {
      return scale_reg;
    }
    scale_reg = x;
    return chart;
  };

  //getter / setter for scale_tmp
  chart.scale_tmp = function (x) {
    if (!arguments.length) {
      return scale_tmp;
    }
    scale_tmp = x;
    return chart;
  };

  //getter / setter for scale_scroll
  chart.scale_scroll = function (x) {
    if (!arguments.length) {
      return scale_scroll;
    }
    scale_scroll = x;
    return chart;
  };

  //getter / setter for params
  chart.params = function (x) {
    if (!arguments.length) {
      return params;
    }
    params = x;
    return chart;
  };

  //getter / setter for highlight_points
  chart.highlight_points = function (x) {
    if (!arguments.length) {
      return highlight_points;
    }
    highlight_points = x;
    return chart;
  };

  //getter / setter for bubbleset_points
  chart.bubbleset_points = function (x) {
    if (!arguments.length) {
      return bubbleset_points;
    }
    bubbleset_points = x;
    return chart;
  };

  //getter / setter for outside_points
  chart.outside_points = function (x) {
    if (!arguments.length) {
      return outside_points;
    }
    outside_points = x;
    return chart;
  };

  //getter / setter for this_chart
  chart.this_chart = function (x) {
    if (!arguments.length) {
      return this_chart;
    }
    this_chart = x;
    return chart;
  };

  //getter / setter for tilt_time
  chart.tilt_time = function (x) {
    if (!arguments.length) {
      return tilt_time;
    }
    tilt_time = x;
    return chart;
  };

  //getter / setter for tilt_selection
  chart.tilt_selection = function (x) {
    if (!arguments.length) {
      return tilt_selection;
    }
    tilt_selection = x;
    return chart;
  };

  //getter / setter for loop_count
  chart.loop_count = function (x) {
    if (!arguments.length) {
      return loop_count;
    }
    loop_count = x;
    return chart;
  };

  //getter / setter for caption_text
  chart.caption_text = function (x) {
    if (!arguments.length) {
      return caption_text;
    }
    caption_text = x;
    return chart;
  };

  //getter / setter for annotation_points
  chart.annotation_points = function (x) {
    if (!arguments.length) {
      return annotation_points;
    }
    annotation_points = x;
    return chart;
  };
 
  return chart;

};

module.exports = d3.chart;