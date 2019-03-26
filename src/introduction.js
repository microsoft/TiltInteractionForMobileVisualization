var d3 = require("d3");
var globals = require("./globals");
var chart = require("./chart");
var nationData = require("./data/studyData");
var countrySelector = require("./countrySelector");

function introduction (scene) {

  suppress_touch_feedback = true;
  suppress_touch_val_feedback = true;
  globals.trial_response = [];
  chart_stage = -1;

  var checkExist;  
  var checkTouch;
  var attempts = 0;

  chart_instance = chart();

  all_data = nationData;  
  if (non_interactive){
    var codes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]; //,
    codes = shuffle(codes);
    all_data.forEach(function (d,i){ 
      d.code = codes[i]; 
    });
  }
  else {
    all_data.forEach(function (d){ 
      d.code = d.orig_code; 
    });
  }   
    
  function getDims() {
    height = window.innerHeight;
    width = window.innerWidth;
    svg_dim = d3.min([height,width]) - 2;
    inner_padding = svg_dim * 0.1;
    chart_dim = svg_dim * 0.8;
  }

  function draw() {
  
    getDims();
        
    d3.select('#main_svg')
    .style('height',svg_dim + 'px')
    .style('width',svg_dim + 'px');
    
    chart_g.attr('transform','translate(' + inner_padding + ',' + inner_padding + ')');
  
    d3.selectAll('.guide').remove();
    chart_instance.lines('off'); 
    chart_instance.animation('off');
    chart_instance.facets('off');
    chart_instance.current_year(globals.param_yearMin);

    chart_g.call(chart_instance);
    d3.selectAll('.mark').style('display','none');
    d3.select('.year_indicator').style('display','none');
    chart_g.call(chart_instance);
  
  }

  function loadData () {     

    checkExist = setInterval(function() {
      if (all_data != undefined) {        
        chart_g.datum(all_data);
        draw();    
        
        hideAddressBar();

        d3.select('#introduction_div')
        .style('visibility','visible');

        globals.log_message = { 
          "TimeStamp": new Date().valueOf(),
          "user_id": globals.userID, 
          "Event": "IntroEvent",
          "EventType": "loadData", 
        };

        console.log("IntroEvent", globals.log_message);
        appInsights.trackEvent("IntroEvent", globals.log_message);

        clearInterval(checkExist);
      }
    }, 100); // check every 100ms

    chart_instance = chart();
  
    main_svg = d3.select('#main_svg').remove();
  
    main_svg = d3.select('#introduction_div').append('svg')
    .attr('id','main_svg')
    .style('margin-top',-40 + 'px');  
  
    defs = d3.select('#main_svg').append('defs');
  
    chart_g = main_svg.append('g')
    .attr('id','chart_g');    
    
    document.getElementById('introduction_div').focus();

  } 

  function build_chart(stage) {

    switch (stage) {

      case 0:

        instruction_text.html('6. In this experiment, you will view charts depicting numerical values. In this example, <span class="instruction_emphasis">Life Expectancy</span> increases from left to right, and <span class="instruction_emphasis">GDP Per Capita</span> (a common economic indicator) increases from bottom to top.'); 
        loadData();

        break;

      case 1:

        instruction_text.html('7. Each of the circles below represents a country, where the <span class="instruction_emphasis">size</span> of a circle represents the corresponding country\'s <span class="instruction_emphasis">Population</span>.<br><br>'); 

        d3.selectAll('.mark').select('circle')
        .style('fill','#54b2fc');
        d3.selectAll('.mark').select('text').style('display','none');
        d3.selectAll('.mark').style('display',null);
        chart_instance.animation('off');
        chart_g.call(chart_instance);

        break;

      case 2:

        instruction_text.html('8. In this experiment, we won\'t use the real names of countries. Instead, we will assign each country a letter, and we will color the countries according to the continent in which they can be found.<br>'); 

        var scale_reg = chart_instance.scale_reg();
        var color_param = chart_instance.params().color;

        d3.selectAll('.mark').select('circle')
        .style('fill',function(d){
          return scale_reg(d[color_param]);
        });
        d3.selectAll('.mark').select('text').style('display',null);
        d3.selectAll('.mark').style('display',null);

        break;

      case 3:

        instruction_text.html('9. This chart reflects the 1975 <span class="instruction_emphasis">Life Expectancy</span>, <span class="instruction_emphasis">GDP Per Capita</span>, and <span class="instruction_emphasis">Population</span> values for these countries.<br><br>'); 

        d3.select('.year_indicator').style('display',null);

        break;

      case 4:

        instruction_text.html('10. The animation shows how the <span class="instruction_emphasis">Life Expectancy</span>, <span class="instruction_emphasis">GDP Per Capita</span>, and <span class="instruction_emphasis">Population</span> of these countries changed between 1975 and 2000. The animation will start over after reaching the year 2000.<br>'); 

        chart_instance.animation('on');
        chart_g.call(chart_instance);

        break;

      case 5:

        switch (globals.condition) {

          case 'stepper':

            instruction_text.html('11. <span class="instruction_emphasis">Tap or hold</span> the buttons below to navigate in time. The <span class="instruction_emphasis">ring</span> (bottom-right) must be complete to continue.'); 

            addmenu();
            chart_instance.current_year(globals.param_yearMin);
            chart_instance.animation('off');
            chart_instance.loop_count(0);
            update_outer_progress(1 / 25);
            chart_g.call(chart_instance);
            d3.select('#submit_btn').attr('class','menu_btn_disabled').attr('disabled',true);


            break;

          case 'animation':

            instruction_text.html('11. The ring (bottom-right) will show the <span class="instruction_emphasis">progress of the animation</span>. You may proceed once the ring is complete.'); 

            addmenu();
            chart_instance.current_year(globals.param_yearMin);
            chart_instance.loop_count(0);
            update_outer_progress(1 / 25);
            chart_instance.animation('on');
            chart_g.call(chart_instance);
            d3.select('#submit_btn').attr('class','menu_btn_disabled').attr('disabled',true);

            break;

          case 'multiples':

            instruction_text.html('11. Here\'s another way to show the same data. Instead of a single chart, each country has its own chart, where the <span class="instruction_emphasis">dot corresponds to the final values</span>, and each country\'s trajectory is drawn as a line.');

            d3.select('.year_indicator').style('display','none');
            chart_instance.animation('off');
            chart_instance.current_year(globals.param_yearMax);
            chart_instance.lines('on');
            chart_instance.facets('on');
            chart_g.call(chart_instance);
            // d3.select('#submit_btn').attr('class','menu_btn_disabled').attr('disabled',true);

            break;

          default:

            break;

        }       

        break;

      case 6:
      
        instruction_text.html('');        
        
        var intro_content_div = d3.select('#introduction_div')
        .append('div')
        .attr('class','toolbar')
        .style('width','100%')
        .style('height',(window.innerHeight - 50) + 'px')
        .attr('id','intro_content_div');   

        intro_content_div.append('span')
        .attr('class','consent_text')
        .html('<span style="text-align:left; font-size:0.8em;">12. In the experiment, you\'ll be asked to select one or more countries based on their characteristics.' + 
        '<br><br>In some cases, there may be more correct responses than required responses, and the order in which you select responses does not matter.' + 
        '<br><br>If you change your mind about a selection, tap it again to de-select it.' + 
        '<br><br>Tap <span class="instruction_emphasis">NEXT</span> to perform a practice trial.</span>');   

        d3.select('#main_svg').style('display','none');
        d3.select('#menubar').style('display','none');

        switch (globals.condition) {

          case 'stepper':

            chart_instance.current_year(globals.param_yearMin);
            chart_instance.animation('off');
            chart_instance.loop_count(0);
            update_outer_progress(1 / 25);
            chart_g.call(chart_instance);

            break;

          case 'animation':

            chart_instance.current_year(globals.param_yearMin);
            chart_instance.loop_count(0);
            update_outer_progress(1 / 25);
            chart_instance.animation('on');
            chart_g.call(chart_instance);

            break;

          case 'multiples':

            chart_instance.animation('off');
            chart_instance.current_year(globals.param_yearMax);
            chart_instance.loop_count(0);
            update_outer_progress(0 / 25);
            chart_instance.lines('on');
            chart_instance.facets('on');
            addmenu();
            chart_g.call(chart_instance);

            break;

          default:

            break;

        }       

        d3.select('#menubar').style('display','none');
       
        break;

      case 7:

        d3.select('#instruction_text').remove();
        d3.select('#intro_content_div').remove();
        d3.select('#submit_btn').style('display','none');
        d3.select('#instruction_div').style('display','none');
        d3.select('.year_indicator').style('display','none');
        d3.selectAll('.mark').style('display','none');
        d3.selectAll('.line').style('display','none');
        d3.select('#main_svg').style('display',null)        
        .style('margin-top',0 + 'px'); 
        
        d3.select('#introduction_div').append('div')
        .attr('class', 'feedback_btn_enabled')
        .style('border-color','transparent')
        .style('top',(svg_dim + 5) + 'px')
        .attr('id','start_btn')
        .style('height','125px');

        d3.select('#start_btn').append('span')
        .attr('id','button_text')
        .html('<span>Take note of the <span class="instruction_emphasis" style="color:gold;">two chart axes</span> above and this instruction:</span><br>' + (globals.condition != 'multiples' ? ' View <span class=\'instruction_emphasis\'>all years</span>, s' : 'S') + 'elect <span class="instruction_number">three</span> countries that are <span class="instruction_emphasis">labeled with VOWELS</span>.<br>' + '<span id="time_warning">You may proceed after <span class="instruction_emphasis">5 seconds</span>.</span>' + '<span id="time_delay_message"  style="display:none;">Tap on this message to start this <span class="instruction_emphasis">PRACTICE</span> trial.</span>'); 

        setTimeout(function(){
          // allow participant to proceed after 5s

          d3.select('#time_warning')
          .style('display','none');

          d3.select('#time_delay_message')
          .style('display',null);

          d3.select('#start_btn')
          .style('border-color','#fff')
          .on('touchstart', function() {   
            d3.select('#start_btn').remove();
            chart_instance.current_year(globals.condition == 'multiples' ? globals.param_yearMax : globals.param_yearMin);
            chart_instance.loop_count(0);
            update_outer_progress(1 / 25);
            chart_g.call(chart_instance);
            
            d3.selectAll('.mark').style('display',null);
            d3.selectAll('.line').style('display',globals.condition == 'multiples' ? null : 'none');
            d3.select('.year_indicator').style('display',null);
            d3.select('#menubar').style('display',null);

            d3.select('.task_instruction_span')
            .html((globals.condition != 'multiples' ? ' View <span class=\'instruction_emphasis\'>all years</span>, s' : 'S') + 'elect <span class="instruction_number">three</span> countries that are <span class="instruction_emphasis">labeled with VOWELS</span> using the buttons below, then tap \'DONE\'.');  

            countrySelector();      
          }); 
        }, 5000); 

        break;

      default:

        chart_instance.animation('off');
        chart_instance.current_year(globals.param_yearMax);
        chart_instance.loop_count(0);
        update_outer_progress(0 / 25);
        chart_g.call(chart_instance);

        d3.select('#introduction_div').remove();
        if (document.getElementById('introduction_div') != undefined) {      
          document.getElementById('introduction_div').remove(); 
        }

        globals.log_message = { 
          "TimeStamp": new Date().valueOf(),
          "user_id": globals.userID,
          "Event": "Intro",
          "Scene": scene + 1
        };

        console.log('Intro',globals.log_message);
        appInsights.trackEvent("Intro", globals.log_message);

        scene = 7;
        introduction(scene);

        break;

    }   

  }
      
  /** INIT **/
  
  d3.select('body').append('div')
  .attr('id','introduction_div')
  .attr('tabindex',0);  

  var instruction_div = d3.select('#introduction_div').append('div')
  .attr('class','toolbar')
  .attr('id','instruction_div');

  var instruction_text = instruction_div.append('span')
  .attr('id','instruction_text');  

  switch (scene) {

    case 0:

      instruction_text.html('Please review the following protocols before beginning the experiment.');    
      d3.select('#introduction_div')
      .style('visibility','visible');

      break;   
      
    case 1:

      instruction_text.html('1. For the duration of this experiment, hold your phone in <span class="instruction_emphasis">portrait mode</span>.');    
      d3.select('#introduction_div')
      .style('visibility','visible'); 

      getDims();

      main_svg = d3.select('#introduction_div').append('svg')
      .attr('id','main_svg')
      .style('height',svg_dim + 'px')
      .style('width',svg_dim + 'px')
      .style('margin-top',-40 + 'px');

      main_svg.append('svg:image')
      .attr('class','instruction_svg')
      .attr("xlink:href", "assets/portrait.svg")
      .attr("width", chart_dim)
      .attr("height", chart_dim)
      .attr("x", inner_padding)
      .attr("y", inner_padding);
          
      document.getElementById('introduction_div').focus();

      break;

    case 2:
  
      instruction_text.html('2. Hold your phone with one hand and use the <span class="instruction_emphasis">index finger on your other hand</span> to touch your phone. It doesn\'t matter which hand holds the phone; just ensure that you are comfortable. However, do not switch the arrangement of your hands during the experiment.');    
      d3.select('#introduction_div')
      .style('visibility','visible'); 

      getDims();

      main_svg = d3.select('#introduction_div').append('svg')
      .attr('id','main_svg')
      .style('height',svg_dim + 'px')
      .style('width',svg_dim + 'px');

      main_svg.append('svg:image')
      .attr('class','instruction_svg')
      .attr("xlink:href", "assets/holdingphone.svg")
      .attr("width", chart_dim)
      .attr("height", chart_dim)
      .attr("x", inner_padding)
      .attr("y", inner_padding);
          
      document.getElementById('introduction_div').focus();

      break;

    case 3:
    
      instruction_text.html('3. Make sure that your phone\'s <span class="instruction_emphasis">brightness</span> level is set to <span class="instruction_emphasis">maximum</span>.');    
      d3.select('#introduction_div')
      .style('visibility','visible'); 

      getDims();

      main_svg = d3.select('#introduction_div').append('svg')
      .attr('id','main_svg')
      .style('height',svg_dim + 'px')
      .style('width',svg_dim + 'px');

      main_svg.append('svg:image')
      .attr('class','instruction_svg')
      .attr("xlink:href", "assets/brightness.svg")
      .attr("width", chart_dim)
      .attr("height", chart_dim)
      .attr("x", inner_padding)
      .attr("y", inner_padding);
          
      document.getElementById('introduction_div').focus();

      break;
    
    case 4:
    
      instruction_text.html('4. Ensure a stable <span class="instruction_emphasis">WiFi</span> network and sufficient <span class="instruction_emphasis">battery power</span> for approximately <span class="instruction_emphasis">20 minutes</span>.');    
      d3.select('#introduction_div')
      .style('visibility','visible'); 

      getDims();

      main_svg = d3.select('#introduction_div').append('svg')
      .attr('id','main_svg')
      .style('height',svg_dim + 'px')
      .style('width',svg_dim + 'px');

      main_svg.append('svg:image')
      .attr('class','instruction_svg')
      .attr("xlink:href", "assets/wifi.svg")
      .attr("width", chart_dim)
      .attr("height", chart_dim)
      .attr("x", inner_padding)
      .attr("y", inner_padding);
          
      document.getElementById('introduction_div').focus();

      break; 
      
    case 5:
    
      instruction_text.html('5. <span class="instruction_emphasis">DO NOT</span> tap your browser\'s back or refresh buttons at any time.');    
      d3.select('#introduction_div')
      .style('visibility','visible'); 

      getDims();

      main_svg = d3.select('#introduction_div').append('svg')
      .attr('id','main_svg')
      .style('height',svg_dim + 'px')
      .style('width',svg_dim + 'px');

      main_svg.append('svg:image')
      .attr('class','instruction_svg')
      .attr("xlink:href", "assets/nonav.svg")
      .attr("width", chart_dim)
      .attr("height", chart_dim)
      .attr("x", inner_padding)
      .attr("y", inner_padding);
          
      document.getElementById('introduction_div').focus();

      break;

    case 6: 

      globals.log_message = { 
        "TimeStamp": new Date().valueOf(),
        "Event": "IntroChartBuild",
        "user_id": globals.userID
      };
  
      console.log("IntroChartBuild", globals.log_message);
      appInsights.trackEvent("IntroChartBuild", globals.log_message);

      break;
    
    case 7:

      d3.select('#selector_div').remove();
      d3.select('#instruction_div').remove();
      
      var intro_content_div = d3.select('#introduction_div')
      .append('div')
      .attr('class','toolbar')
      .style('width','100%')
      .style('height',(window.innerHeight - 50) + 'px')
      .attr('id','intro_content_div');        

      intro_content_div.append('span')
      .attr('class','consent_text')
      .html('<span style="text-align:left; font-size:0.9em;"><p>Congratulations!<br><br> You are now <span class="instruction_emphasis">ready to begin</span> the experiment, where you will answer 13 questions. </p> ' + 
      '<p>The remainder of the experiment will proceed as follows:</p>' + 
      '<ol>' +
      '<li> <span class="instruction_emphasis">13 questions:</span>' + 
      '<ul>' +
      '<li>These include  <span class="instruction_emphasis">3 practice questions</span> and <span class="instruction_emphasis">10 test questions</span>.' +
      '<li>Some questions may have <span class="instruction_emphasis">multiple correct responses</span>.' +
      '<li>Each question is expected to take under a minute to complete.' + 
      '<li>The question will always be shown below the chart.' +
      '</ul><li> An <span class="instruction_emphasis">exit survey</span> containing <span class="instruction_emphasis">3 questions</span>.' +
     
      '</ol></span>'
      );    

      d3.select('#introduction_div')
      .style('visibility','visible');        

      break;

    default: // return to main menu

      d3.select('#introduction_div').remove();
      if (document.getElementById('introduction_div') != undefined) {      
        document.getElementById('introduction_div').remove(); 
      }

      globals.log_message = { 
        "TimeStamp": new Date().valueOf(),
        "Event": "IntroComplete",
        "user_id": globals.userID
      };

      console.log("IntroComplete", globals.log_message);
      appInsights.trackEvent("IntroComplete", globals.log_message);

      introduction_complete = true;
      suppress_touch_feedback = false;
      suppress_touch_val_feedback = false;
      loadMenu();
      hideAddressBar();   

      break;
  }
  
  d3.select('#introduction_div').append('input')
  .attr('class', 'menu_btn_enabled')
  .attr('id','submit_btn')
  .attr('type','button')
  .attr('value', scene == 16 ? 'BEGIN' : 'NEXT')
  .attr('title', scene == 16 ? 'BEGIN' : 'NEXT')
  .on('touchstart', nextIntroScene);

  function nextIntroScene () {

    d3.event.preventDefault();          

    if (d3.select(this).attr('disabled') == null) {
      if (chart_stage == 7) {
        attempts++;

        d3.select('#main_svg').attr('class','blurme');
        d3.select('#selector_div').remove();
        d3.select('#menubar').style('display','none');

        var score = 0;
        if (globals.trial_response.indexOf('A') != -1) {
          score++;
        }
        if (globals.trial_response.indexOf('E') != -1) {
          score++;
        }
        if (globals.trial_response.indexOf('I') != -1) {
          score++;
        }
        if (globals.trial_response.indexOf('O') != -1) {
          score++;
        }
        if (score != 3) {

          var incorrect_feedback_btn =  d3.select('#introduction_div').append('div')
          .attr('class', 'feedback_btn_enabled')
          .attr('id','feedback_btn')
          .style('background','#ef5350')
          .style('border-color','#fff')        
          .on('touchstart', function() {  

            d3.event.preventDefault(); 

            d3.select('#progress_indicator').style('display',null);
            d3.select('#outer_progress_indicator')
            .attr('display', globals.condition == 'multiples' ? 'none' : null);
            d3.select('#done_btn').attr('class','img_btn_disabled')
            .style('display','none')
            .attr('disabled',true)
            .attr('src', 'assets/na.svg')
            .style('margin', function(){
              return height < width ? '0px' : '2px';
            })
            .attr('height', function(){
              return height < width ? (height / 7 - 6) : (width / 7 - 6);
            })
            .attr('width', function (){
              return width < height ? (width / 7 - 6) : (height / 7 - 6);
            });
            d3.select('#feedback_btn').remove();
            d3.select('#menubar').style('display',null);
            d3.select('#main_svg').attr('class',null);
            globals.num_selected = 0;
            globals.trial_response = [];            
            countrySelector();
            d3.select('#inner_progress_value').attr('d', globals.inner_progress_circle.endAngle(0));
            
            //try again
          });

          incorrect_feedback_btn.append('span')
          .attr('id','button_text')
          .style('color','#111')
          .style('font-weight','400')
          .html(function() {    
            if (attempts > 1) {
              return '<span class="correct_incorrect">INCORRECT</span><br>Tap on this message to try again.<br> (Hint: Vowels include A, E, I, O, & U).';
            }
            else {
              return '<span class="correct_incorrect">INCORRECT</span><br>Tap on this message to try again.';
            }
          }); 

        } 
        else {
          chart_stage++;
          build_chart(chart_stage);
        }
      }
      else if (scene != 5) {
        d3.select('#introduction_div').remove();
        if (document.getElementById('introduction_div') != undefined) {      
          document.getElementById('introduction_div').remove(); 
        }

        globals.log_message = { 
          "TimeStamp": new Date().valueOf(),
          "user_id": globals.userID,
          "Event": "Intro",
          "Scene": scene + 1
        };

        console.log("Intro", globals.log_message);
        appInsights.trackEvent("Intro", globals.log_message);
  
        introduction(scene + 1);
      }
      else {
        chart_stage++;
        build_chart(chart_stage);
      }
    } 
  }

  function addmenu () {
    var menubar = d3.select('#introduction_div').append('div')
    .attr('class','toolbar')
    .attr('id','menubar')
    .style('float', function(){
      return height < width ? 'left' : 'inherit';
    })
    .style('width', function(){
      return height < width ? (height / 7) + 'px'  : width + 'px';
    })
    .style('height', function(){
      return height < width ? height + 'px'  : (width / 7) + 'px';
    });  

    menubar.append("input")
    .attr('class', 'img_btn_disabled')  
    .attr('id','prev_btn')
    .style('display',globals.condition == 'stepper' ? null : 'none')
    .style('margin', function(){
      return height < width ? '0px' : '2px';
    })
    .attr('height', function(){
      return height < width ? (height / 7 - 6) : (width / 7 - 6);
    })
    .attr('width', function (){
      return width < height ? (width / 7 - 6) : (height / 7 - 6);
    })
    .attr('type','image')
    .attr('name','PrevToggle')
    .attr('title', 'PrevToggle')
    .attr('disabled', true)
    .attr('src', globals.condition == 'stepper' ? 'assets/prev_grey.svg' : 'assets/na.svg')
    .on('touchstart', function() {    
      d3.event.preventDefault();          

      if (globals.condition == 'stepper'){

        d3.select(this).attr('src', globals.condition == 'stepper' ? (chart_instance.loop_count() < 1 ? 'assets/prev_grey.svg' : 'assets/prev_gold.svg') : 'assets/na.svg');
        chart_instance.this_chart().interrupt();
        

        if (chart_instance.current_year() != chart_instance.params().yearMin) {      
          var prev_year = chart_instance.current_year() - 1;
          chart_instance.current_year(prev_year);
          var outer_progress =  ((prev_year + 1) - chart_instance.params().yearMin) / ((chart_instance.params().yearMax + 1) - chart_instance.params().yearMin);
          update_outer_progress(chart_instance.loop_count() + outer_progress);
          
        }
        else if (chart_instance.loop_count() > 0 && chart_instance.current_year() == chart_instance.params().yearMin) {
          chart_instance.current_year(chart_instance.params().yearMax);
          d3.selectAll('.mark').style('display','none');
            d3.selectAll('.path_line').style('display','none');
            setTimeout(function(){
              d3.selectAll('.mark').style('display',null);
              d3.selectAll('.path_line').style('display',null);
            }, 500);
        }
        chart_g.call(chart_instance);

        checkTouch = setInterval(function() {
          if (chart_instance.current_year() != chart_instance.params().yearMin) {
            var prev_year = chart_instance.current_year() - 1;
            chart_instance.current_year(prev_year);   
            var outer_progress =  ((prev_year + 1) - chart_instance.params().yearMin) / ((chart_instance.params().yearMax + 1) - chart_instance.params().yearMin);
            update_outer_progress(chart_instance.loop_count() + outer_progress);
          }
          else if (chart_instance.loop_count() > 0 && chart_instance.current_year() == chart_instance.params().yearMin) {
            chart_instance.current_year(chart_instance.params().yearMax);
            d3.selectAll('.mark').style('display','none');
            d3.selectAll('.path_line').style('display','none');
            setTimeout(function(){
              d3.selectAll('.mark').style('display',null);
              d3.selectAll('.path_line').style('display',null);
            }, 500);
          }
          chart_g.call(chart_instance);
          
        }, 500); // check every 500ms if touch is ongoing          

      }
    })
    .on('touchend', function(){
      
      d3.event.preventDefault();
      clearInterval(checkTouch);

      if (globals.condition == 'stepper') {
        d3.select(this).attr('class',(chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? 'img_btn_disabled' : 'img_btn_enabled')
        .attr('disabled', (chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? true : null)
        .attr('src', (chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? 'assets/prev_grey.svg' : 'assets/prev.svg');
      }
    });    

    menubar.append("input")
    .attr('id','next_btn')
    .style('display',globals.condition == 'stepper' ? null : 'none')
    .attr('class', globals.condition == 'stepper' ? 'img_btn_enabled' : 'img_btn_disabled')  
    .style('margin', function(){
      return height < width ? '0px' : '2px';
    })
    .attr('height', function(){
      return height < width ? (height / 7 - 6) : (width / 7 - 6);
    })
    .attr('width', function (){
      return width < height ? (width / 7 - 6) : (height / 7 - 6);
    })
    .attr('type','image') 
    .attr('name','NextToggle')
    .attr('title', 'NextToggle')
    .attr('src', globals.condition == 'stepper' ? 'assets/next.svg' : 'assets/na.svg')
    .attr('disabled', globals.condition == 'stepper' ? null : true)
    .on('touchstart', function() {    
      d3.event.preventDefault();    

      if (globals.condition == 'stepper'){

        d3.select(this).attr('src', globals.condition == 'stepper' ? 'assets/next_gold.svg' : 'assets/na.svg');
        chart_instance.this_chart().interrupt();

        if (chart_instance.current_year() == chart_instance.params().yearMax) {
          chart_instance.current_year(chart_instance.params().yearMin);
          d3.selectAll('.mark').style('display','none');
          d3.selectAll('.path_line').style('display','none');
          setTimeout(function(){
            d3.selectAll('.mark').style('display',null);
            d3.selectAll('.path_line').style('display',null);
          }, 500);
        }
        else {
          var next_year = chart_instance.current_year() + 1;
          var outer_progress =  ((next_year + 1) - chart_instance.params().yearMin) / ((chart_instance.params().yearMax + 1) - chart_instance.params().yearMin);
          update_outer_progress(chart_instance.loop_count() + outer_progress);
          if (chart_instance.current_year() == (chart_instance.params().yearMax - 1)) {
            chart_instance.loop_count(chart_instance.loop_count() + 1);
            // d3.select('#progress_indicator').style('display','none');
            if (chart_stage == 7 && globals.num_selected == 3) {
              
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
          }
          chart_instance.current_year(next_year);
        }
        chart_g.call(chart_instance);     

        checkTouch = setInterval(function() {
          if (chart_instance.current_year() == chart_instance.params().yearMax) {
            chart_instance.current_year(chart_instance.params().yearMin);
            d3.selectAll('.mark').style('display','none');
            d3.selectAll('.path_line').style('display','none');
            setTimeout(function(){
              d3.selectAll('.mark').style('display',null);
              d3.selectAll('.path_line').style('display',null);
            }, 500);
          }
          else {
            var next_year = chart_instance.current_year() + 1;
            var outer_progress =  ((next_year + 1) - chart_instance.params().yearMin) / ((chart_instance.params().yearMax + 1) - chart_instance.params().yearMin);
            update_outer_progress(chart_instance.loop_count() + outer_progress);
            if (chart_instance.current_year() == (chart_instance.params().yearMax - 1)) {
              chart_instance.loop_count(chart_instance.loop_count() + 1);
              // d3.select('#progress_indicator').style('display','none');
              if (chart_stage == 7 && globals.num_selected == 3) {                
                d3.select('#progress_indicator').style('display','none');
                d3.select('#done_btn').attr('class','img_btn_enabled')
                .style('display',null)
                .attr('disabled',null)
                .attr('src', 'assets/done.svg');
              }
              else{
                d3.select('#submit_btn').attr('class','menu_btn_enabled')
                .attr('disabled',null);
              }
            }
            chart_instance.current_year(next_year);
          }
          chart_g.call(chart_instance);
        }, 500); // check every 500ms if touch is ongoing    

      }
    })
    .on('touchend', function(){

      d3.event.preventDefault();
      clearInterval(checkTouch);

      d3.select(this).attr('src', globals.condition == 'stepper' ? 'assets/next.svg' : 'assets/na.svg');

      if (globals.condition == 'stepper') {
        d3.select('#prev_btn').attr('class',(chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? 'img_btn_disabled' : 'img_btn_enabled')
        .attr('disabled', (chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? true : null)
        .attr('src', (chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? 'assets/prev_grey.svg' : 'assets/prev.svg');
      }
    });    

    var progress_radius = (height < width ? (height / 7 - 6) : (width / 7 - 6)) / 2;
    var progress_stroke = 2;
    var progress_dim = progress_radius * 2;

    var prompt = menubar.append("div")
    .attr('id','prompt')
    .style('margin','2px')
    .style('height', (progress_dim) + 'px')
    .style('width', (width - progress_dim * (globals.condition == 'stepper' ? 3 : 1) - (globals.condition == 'stepper' ? 24 : 12)) + 'px')
    .on('touchstart', function() {    
      d3.event.preventDefault(); 
    });

    prompt.append('span')
    .attr('class','task_instruction_span')
    .html('');      

    //progress indicators
    var progress_colors = {
      outer_fill: 'gold',
      inner_fill: '#fff',
      track: '#999',
      stroke: '#333',
    };

    menubar.append("input")
    .attr('class', 'img_btn_disabled')
    .attr('disabled',true)
    .style('display','none')
    .style('margin','2px')
    .style('height', progress_dim + 'px')
    .style('width', progress_dim + 'px')
    .attr('id','done_btn')
    .attr('type','image')
    .attr('name','Done')
    .attr('title', 'Done')
    .attr('src', 'assets/na.svg')
    .on('touchstart', nextIntroScene);

    var progress_svg = menubar.append("svg")
    .attr('disabled',true)
    .attr('id','progress_indicator')
    .attr('height', progress_dim)
    .attr('width', progress_dim);
    
    globals.outer_progress_circle = d3.arc()
    .startAngle(0)
    .cornerRadius(7.5)
    .innerRadius(progress_radius)
    .outerRadius(progress_radius - 7.5);

    var outer_track_circle = d3.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2)
    .innerRadius(progress_radius)
    .outerRadius(progress_radius - 7.5);

    globals.inner_progress_circle = d3.arc()
    .startAngle(0)
    .cornerRadius(7.5)
    .innerRadius(progress_radius - 7.5)
    .outerRadius(progress_radius - 15);

    var inner_track_circle = d3.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2)
    .innerRadius(progress_radius - 7.5)
    .outerRadius(progress_radius - 15);

    var outer_progress_track = progress_svg.append('g')
    .attr('id','outer_progress_indicator')
    .attr('display', globals.condition == 'multiples' ? 'none' : null)
    .attr('transform', 'translate(' + progress_dim / 2 + ',' + progress_dim / 2 + ')');
    
    outer_progress_track.append('path')
    .attr('fill', progress_colors.track)
    .attr('stroke', progress_colors.stroke)
    .attr('stroke-width', progress_stroke + 'px')
    .attr('d', outer_track_circle);

    outer_progress_track.append('path')
    .attr('id', 'outer_progress_value')
    .attr('fill', progress_colors.outer_fill)
    .attr('stroke', progress_colors.stroke)
    .attr('stroke-width', progress_stroke + 'px')
    .attr('d', globals.inner_progress_circle.endAngle(0));     

    update_outer_progress(1 / ((chart_instance.params().yearMax + 1) - chart_instance.params().yearMin));

    var inner_progress_track = progress_svg.append('g')
    .attr('id','inner_progress_indicator')
    .attr('display', null)
    .attr('transform', 'translate(' + progress_dim / 2 + ',' + progress_dim / 2 + ')');
    
    inner_progress_track.append('path')
    .attr('fill', progress_colors.track)
    .attr('stroke', progress_colors.stroke)
    .attr('stroke-width', progress_stroke + 'px')
    .attr('d', inner_track_circle);

    inner_progress_track.append('path')
    .attr('id', 'inner_progress_value')
    .attr('fill', progress_colors.inner_fill)
    .attr('stroke', progress_colors.stroke)
    .attr('stroke-width', progress_stroke + 'px')
    .attr('d', globals.inner_progress_circle.endAngle(0));
  }

  function update_outer_progress(progress) {
    if (globals.condition != 'multiples') {
      d3.select('#outer_progress_value').attr('d', globals.outer_progress_circle.endAngle((Math.PI * 2) * progress));
    }
  } 
 
}

module.exports = introduction;
