var d3 = require("d3");
var globals = require("./globals");
var chart = require("./chart");
var nationData = require("./data/studyData");
var countrySelector = require("./countrySelector");

function trial () {

  suppress_touch_val_feedback = true;
  suppress_touch_feedback = true;  
  globals.trial_response = [];
  globals.num_selected = 0;
  
  var checkExist;    
  var checkTouch;
  var trial;
  var giveup;
  
  function getDims() {
    height = window.innerHeight;
    width = window.innerWidth;
    svg_dim = d3.min([height,width]) - 2;
    inner_padding = svg_dim * 0.1;
    chart_dim = svg_dim * 0.8;
  }
  
  function draw() {
          
    d3.select('#main_svg')
    .style('height',svg_dim + 'px')
    .style('width',svg_dim + 'px');
    
    chart_g.attr('transform','translate(' + inner_padding + ',' + inner_padding + ')');
  
    d3.selectAll('.guide').remove();
    chart_instance.lines(globals.lines); 
    chart_instance.animation('off');
    chart_instance.facets(globals.facets);
    chart_instance.current_year(globals.facets == 'on' ? globals.param_yearMax : globals.param_yearMin);

    chart_g.call(chart_instance);
    scale_reg = chart_instance.scale_reg();
    d3.select('.year_indicator').style('display','none');
    d3.selectAll('.mark').style('visibility','hidden');
    chart_g.call(chart_instance);
  
    d3.selectAll('.toolbar')
    .style('float', function(){
      return height < width ? 'left' : 'inherit';
    })
    .style('width', function(){
      return height < width ? (height / 7) + 'px'  : width + 'px';
    })
    .style('height', function(){
      return height < width ? height + 'px'  : (width / 7) + 'px';
    });

    d3.select('#prompt')
    .style('margin', function(){
      return height < width ? '0px' : '2px';
    })
    .style('width', function (){
      return height < width ? (height - (height / 7) * (globals.condition == 'stepper' ? 3 : 1) - 6) + 'px' : (width - (width / 7) * (globals.condition == 'stepper' ? 3 : 1) - 6) + 'px';
    })
    .style('height', function(){
      return height < width ? (height / 7 - 6) : (width / 7 - 6) + 'px';
    }); 

    // d3.select('#trial_div')
    // .style('height', function(){
    //   return svg_dim + (height < width ? (height / 7 - 6) : (width / 7 - 6)) + 'px'; 
    // });

  }
  
  function loadData () {     

    globals.param_x = globals.trials[0].x;
    globals.param_y = globals.trials[0].y;
    globals.param_yearMin = globals.trials[0].yearMin;
    globals.param_yearMax = globals.trials[0].yearMax;

    checkExist = setInterval(function() {
      if (all_data != undefined) {        
        chart_g.datum(all_data);        
        draw();    
        
        nextTrial();
        
        hideAddressBar();

        d3.select('#trial_div')
        .style('visibility','visible');

        clearInterval(checkExist);
      }
    }, 100); // check every 100ms

    chart_instance = chart();    
  
    main_svg = d3.select('#main_svg').remove();
  
    main_svg = d3.select('#trial_div').append('svg')
    .attr('id','main_svg');  
  
    defs = d3.select('#main_svg').append('defs');
  
    chart_g = main_svg.append('g')
    .attr('id','chart_g');    
    
    document.getElementById('trial_div').focus();
  } 

  function nextTrial () {

    d3.selectAll('.mark').style('display',null);
    d3.selectAll('.path_line').style('display',null);
    d3.select('#main_svg').attr('class',null);
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

    d3.select('#progress_indicator').style('display',null);
    d3.select('#outer_progress_indicator')
    .attr('display', globals.facets == 'on' ? 'none' : null);

    update_outer_progress(1 / 25);
    d3.select('#inner_progress_value').attr('d', globals.inner_progress_circle.endAngle(0));

    d3.select('#menubar').style('display','none');
    d3.select('.year_indicator').style('display','none');
    chart_instance.this_chart().interrupt();

    chart_instance.animation('off');
    chart_g.call(chart_instance);
    
    d3.selectAll('.mark').style('visibility','hidden');
    d3.selectAll('.line').style('visibility','hidden');
    if (document.getElementById('selector_div') != null){
      document.getElementById('selector_div').remove();
    }
    globals.trial_index++;
    globals.trial_response = [];

    if (globals.trial_index != max_trials) {

      var trial_prompt = globals.trials[globals.trial_index].prompt;
      var regex = /<span class='instruction_number'>/gi;
      trial_prompt = trial_prompt.replace(regex,"");
      regex = /<span class='instruction_emphasis'>/gi;
      trial_prompt = trial_prompt.replace(regex,"");
      regex = /<\/span>/gi;
      trial_prompt = trial_prompt.replace(regex,"");

      //init next trial
      trial = {
        user_id: globals.userID,
        ordering: globals.ordering,
        trial_index: globals.trial_index,
        condition: globals.condition,
        task_index: globals.trials[globals.trial_index].task_index,
        x: globals.trials[globals.trial_index].x,
        y: globals.trials[globals.trial_index].y,
        prompt: trial_prompt,
        num_responses: globals.trials[globals.trial_index].num_responses,
        correct_responses: globals.trials[globals.trial_index].correct_responses,
        yearMin: globals.trials[globals.trial_index].yearMin,
        yearMax: globals.trials[globals.trial_index].yearMax,
        tutorial: globals.trials[globals.trial_index].tutorial,
        quality_control: globals.trials[globals.trial_index].quality_control,
        responses: [],
        load_time: new Date().valueOf(),
        reading_time: 0,
        reading_interruptions: 0,
        reading_interruption_time: 0,
        start_time: 0,
        interruptions: 0,
        interruption_time: 0,
        end_time: 0,
        completion_time: 0,
        next_step_count: 0,
        prev_step_count: 0,
        loop_count: 0,
        attempts: 0,
        num_errors: 0,
        error: 0,
        give_up: false
      };

      globals.param_x = globals.trials[globals.trial_index].x;
      globals.param_y = globals.trials[globals.trial_index].y;
      globals.param_yearMin = globals.trials[globals.trial_index].yearMin;
      globals.param_yearMax = globals.trials[globals.trial_index].yearMax;

      chart_instance.params().yearMin = globals.param_yearMin;
      chart_instance.current_year(globals.facets == 'on' ? globals.param_yearMax : globals.param_yearMin);
      chart_instance.params().yearMax = globals.param_yearMax;      
      chart_instance.params().x = globals.param_x;
      chart_instance.params().y = globals.param_y;    
      
      chart_g.call(chart_instance);

      d3.select('#trial_div').append('div')
      .attr('class', 'feedback_btn_enabled')
      .style('top',(svg_dim + 5) + 'px')
      .attr('id','start_btn')
      .style('border-color','transparent')
      .style('height','125px');           

      var eur_hex = scale_reg('EU');
      var eur_color = '';
      switch (eur_hex) {

        case '#fad139':
          eur_color = 'yellow';
          break;

        case '#54b2fc':
          eur_color = 'blue';
          break;

        case '#f67afe':
          eur_color = 'pink';
          break;

        case '#8bba32':
          eur_color = 'green';
          break;

        case '#c29aeb':
          eur_color = 'purple';
          break;

        default:
          eur_color = '';
          break;
      }
      
      var eur_rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(scale_reg('EU'));
      var rgb_result = eur_rgb ? {
        r: parseInt(eur_rgb[1], 16),
        g: parseInt(eur_rgb[2], 16),
        b: parseInt(eur_rgb[3], 16)
      } : null;
      var eur_rgba = 'rgba(' + rgb_result.r + ',' + rgb_result.g + ',' + rgb_result.b + ',0.5)';
      
      var eur = eur_color + " / <span style='font-size:1em; -webkit-text-stroke: 0.5px #fff; color:" + eur_rgba + ";'>⬤</span>";

      globals.trials[globals.trial_index].prompt = globals.trials[globals.trial_index].prompt.replace("foo", eur);

      d3.select('#start_btn').append('span')
      .attr('id','button_text')
      .html((globals.trials[globals.trial_index].tutorial ? '<span>Take note of the <span class="instruction_emphasis" style="color:gold;">two chart axes</span> above and this instruction:</span><br>' : '') + globals.trials[globals.trial_index].prompt + '<br>' + '<span id="time_warning">You may proceed after <span class="instruction_emphasis">5 seconds</span>.</span>' + '<span  id="time_delay_message" style="display:none;">Tap on this message to start ' + (globals.trials[globals.trial_index].tutorial ? 'this <span class="instruction_emphasis">PRACTICE</span> trial' : ('trial <span class="instruction_emphasis">' + ((globals.trial_index - 3) + 1) + '</span> of <span class="instruction_emphasis">' + (globals.trials.length - 3) + '</span>'))  + '<br> and TRIGGER THE TIMER.</span>');  

      setTimeout(function(){
        // allow participant to proceed after 5s

        d3.select('#time_delay_message')
        .style('display',null);

        d3.select('#time_warning')
        .style('display','none');

        d3.select('#start_btn')
        .style('border-color','#fff')
        .on('touchstart', function() {   

          startTrial();
        }); 
      }, 5000);

    }
    else {
      globals.trial_index = -1;
      experiment_complete = true;

      chart_instance.animation('off');
      chart_instance.lines('off');
      chart_instance.facets('off');
      chart_instance.loop_count(0);
      
      globals.animation = 'off';
      globals.lines = 'off';
      globals.facets = 'off';

      chart_g.call(chart_instance);

      globals.log_message = { 
        "TimeStamp": new Date().valueOf(),
        "Event": "TrialsCompleted",
        "user_id": globals.userID
      };

      console.log("TrialsCompleted", globals.log_message);
      appInsights.trackEvent("TrialsCompleted", globals.log_message);
      document.getElementById('trial_div').remove();
      
      loadMenu();
      hideAddressBar();  
    }
  }

  function startTrial () {

    chart_instance.loop_count(0);

    d3.select('#menubar').style('display',null);
    d3.select('.year_indicator').style('display',null);

    d3.selectAll('.mark').style('visibility','visible');
    d3.selectAll('.line').style('visibility','visible');

    update_outer_progress(1 / ((chart_instance.params().yearMax + 1) - chart_instance.params().yearMin));

    if (globals.animation == 'on'){
      chart_instance.animation('on');
      chart_g.call(chart_instance);
    }

    d3.selectAll('.img_btn_disabled')
    .style('margin', function(){
      return height < width ? '0px' : '2px';
    })
    .attr('height', function(){
      return height < width ? (height / 7 - 6) : (width / 7 - 6);
    })
    .attr('width', function (){
      return width < height ? (width / 7 - 6) : (height / 7 - 6);
    }); 

    d3.select('#prev_btn').attr('class',(chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? 'img_btn_disabled' : (globals.condition == 'stepper' ? 'img_btn_enabled' : 'img_btn_disabled'))
    .attr('disabled', (chart_instance.current_year() == chart_instance.params().yearMin && chart_instance.loop_count() < 1) ? true : (globals.condition == 'stepper' ? null : true))
    .attr('src', globals.condition == 'stepper' ? 'assets/prev_grey.svg' : 'assets/na.svg');

    d3.select('#next_btn')
    .attr('class', globals.condition == 'stepper' ? 'img_btn_enabled' : 'img_btn_disabled')
    .attr('disabled', globals.condition == 'stepper' ? null : true)
    .attr('src', globals.condition == 'stepper' ? 'assets/next.svg' : 'assets/na.svg');

    d3.select('#done_btn')
    .style('display','none')
    .attr('class', 'img_btn_disabled')
    .attr('disabled',true);

    trial.interruptions = 0;
    trial.interruption_time = 0;
    trial.start_time = new Date().valueOf();
    
    if (resumptions.length > 0 ) {
      var i = resumptions.length - 1;
      while (resumptions[i].resumption_time > trial.load_time && i >= 0) {
        trial.reading_interruptions++;
        trial.reading_interruption_time += resumptions[i].pause_duration;
        i--;
      }
    }

    trial.reading_time = trial.start_time - trial.load_time - trial.reading_interruption_time;
    
    d3.select('#start_btn').remove();
    countrySelector();
    d3.select('.task_instruction_span').html(globals.trials[globals.trial_index].prompt);   

    if (globals.trials[globals.trial_index].tutorial != true) {
      giveUpLoop();
    }

  }

  function giveUpLoop () {

    giveup = setTimeout(function(){
      // I give up / I don't know option presented after 30s
      d3.select('#main_svg').attr('class','blurme');
      d3.select('#selector_div').style('display','none');
      d3.select('#menubar').style('display','none');

      var keep_going_btn =  d3.select('#trial_div').append('div')
      .attr('class', 'feedback_btn_enabled')
      .attr('id','keep_going_btn')
      .style('background','#8bc34a')
      .style('height','50px')
      .style('border-color','#fff')
      .on('touchstart', function() {  

        d3.event.preventDefault(); 
        
        d3.select('#keep_going_btn').remove();
        d3.select('#give_up_btn').remove();
        d3.select('#menubar').style('display',null);
        d3.select('#main_svg').attr('class',null);
        d3.select('#selector_div').style('display',null);            
        giveUpLoop();
        
      });  

      keep_going_btn.append('span')
      .attr('id','button_text')      
      .style('color','#111')
      .style('font-weight','400')
      .html('<span class="correct_incorrect">NEED MORE TIME?</span><br>Tap on this message if you need more time.'); 

      var give_up_btn =  d3.select('#trial_div').append('div')
      .attr('class', 'feedback_btn_enabled')
      .attr('id','give_up_btn')
      .style('height','50px')
      .style('background','#ef5350')
      .style('border-color','#fff')
      .on('touchstart', function() {  

        d3.event.preventDefault(); 
        
        d3.select('#keep_going_btn').remove();
        d3.select('#give_up_btn').remove();  
        trial.give_up = true;     
        endTrial();            
        
      });  

      give_up_btn.append('span')
      .attr('id','button_text')      
      .style('color','#111')
      .style('font-weight','400')
      .html('<span class="correct_incorrect">GIVE UP?</span><br>Tap on this message if you don\'t know the answer.'); 

    }, 60000);

  }

  function endTrial () {

    clearTimeout(giveup);

    if (d3.select('#done_btn').attr('disabled') == null || trial.give_up) {

      var i = 0;
      trial.num_errors = 0;
      trial.loop_count = chart_instance.loop_count();
      trial.attempts++;

      for (i = 0; i < globals.trial_response.length; i++) {
        if (globals.trials[globals.trial_index].correct_responses.indexOf(globals.trial_response[i]) == -1) {
          trial.num_errors++;
        }
      }

      trial.error = trial.num_errors / globals.trials[globals.trial_index].num_responses;

      if (trial.give_up) {
        trial.num_errors = globals.trials[globals.trial_index].num_responses;
        trial.error = 1;
      }

      if (resumptions.length > 0 ) {
        var j = resumptions.length - 1;
        while (resumptions[j].resumption_time > trial.start_time && j >= 0) {
          trial.interruptions++;
          trial.interruption_time += resumptions[j].pause_duration;
          j--;
        }
      }

      trial.end_time = new Date().valueOf();
      trial.completion_time = trial.end_time - trial.start_time - trial.interruption_time;
      trial.responses = globals.trial_response;

      console.log('TrialComplete', trial);
      appInsights.trackEvent("TrialComplete", trial);

      if (globals.trials[globals.trial_index].tutorial == true) {

        d3.select('#main_svg').attr('class','blurme');
        d3.select('#selector_div').remove();
        d3.select('#menubar').style('display','none');
        // give feedback for tutorial trials
        if (trial.error != 0){
          //give negative feedback

          var incorrect_feedback_btn =  d3.select('#trial_div').append('div')
          .attr('class', 'feedback_btn_enabled')
          .attr('id','feedback_btn')
          .style('background','#ef5350')
          .style('border-color','#fff')        
          .on('touchstart', function() {  

            d3.event.preventDefault(); 

            if (trial.attempts >= 2) {
              //show hint   
              all_data.forEach(function (d){
                if (globals.trials[globals.trial_index].correct_responses.indexOf(d.name) != -1) {
                  d3.select('#mark_' + d.code).style('display',null);
                  d3.select('#line_' + d.code).select('.path_line').style('display',null);
                }
                else {
                  d3.select('#line_' + d.code).select('.path_line').style('display','none');
                  d3.select('#mark_' + d.code).style('display','none');
                }
              });

              if (trial.attempts <= 3) {
                setTimeout(function(){
                  // Hide the address bar!
                  d3.selectAll('.mark').style('display',null);
                  d3.selectAll('.path_line').style('display',null);
                }, 1500);    
              }
        
            }

            d3.select('#progress_indicator').style('display',null);
            d3.select('#outer_progress_indicator')
            .attr('display', globals.facets == 'on' ? 'none' : null);
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
            trial.responses = [];
            trial.error = 0;
            trial.num_errors = 0;
            countrySelector();
            d3.select('#inner_progress_value').attr('d', globals.inner_progress_circle.endAngle(0));
            
            //try again
            trial.start_time = new Date().valueOf();
          });  

          incorrect_feedback_btn.append('span')
          .attr('id','button_text')
          .style('color','#111')
          .style('font-weight','400')
          .html(function() {            
            if (trial.attempts > 3) {
              return '<span class="correct_incorrect">INCORRECT</span><br>Tap on this message to see the correct response.';
            } 
            else if (trial.attempts > 1) {
              return '<span class="correct_incorrect">INCORRECT</span><br>Tap on this message to see a brief hint.';
            } 
            else {
               return '<span class="correct_incorrect">INCORRECT</span><br>Tap on this message to try again.';
            }
          }); 
        }
        else {
          //give positive feedback

          d3.select('#selector_div').remove();
          d3.select('#menudiv').remove();
        
          var correct_feedback_btn = d3.select('#trial_div').append('div')
          .attr('class', 'feedback_btn_enabled')
          .attr('id','feedback_btn')
          .style('background','#8bc34a')
          .style('border-color','#fff')
          .on('touchstart', function() { 

            d3.event.preventDefault(); 

            d3.select('#feedback_btn').remove(); 
            if (globals.trial_index == 2) {

              globals.log_message = { 
                "TimeStamp": new Date().valueOf(),
                "Event": "TutorialsCompleted",
                "user_id": globals.userID
              };
        
              console.log("TutorialsCompleted", globals.log_message);
              appInsights.trackEvent("TutorialsCompleted", globals.log_message);

              var timed_trial_warning = d3.select('#trial_div').append('div')
              .attr('class', 'feedback_btn_enabled')
              .attr('id','timed_trial_warning')
              .style('border-color','#fff')
              .on('touchstart', function() {    
                d3.event.preventDefault(); 
                d3.select('#timed_trial_warning').remove(); 
                nextTrial();
              }); 
              
              timed_trial_warning.append('span')
              .attr('id','button_text')
              .style('font-weight','400')
              .html('You have completed the practice trials. Complete the following trials as <span class="instruction_emphasis">quickly</span> and as <span class="instruction_emphasis">accurately</span> as you can. You will not be told if your responses are correct. <br><span class="instruction_emphasis">Tap on this message to continue</span>.');  
            }
            else {
              nextTrial();
            }
             
          });        

          correct_feedback_btn.append('span')
          .attr('id','button_text')
          .style('color','#111')
          .style('font-weight','400')
          .html('<span class="correct_incorrect">CORRECT</span><br>Tap on this message to continue.<br>');  
        }
      }
      else {
        //test trial
        nextTrial();
      }

    }
  }
    
  /** INIT **/
  
  d3.select('body').append('div')
  .attr('id','trial_div')
  .attr('tabindex',0);

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
  loadData(); 

  getDims();

  var menubar = d3.select('#trial_div').append('div')
  .attr('class','toolbar')
  .style('display','none')
  .attr('id','menubar');  

  menubar.append("input")
  .attr('class','img_btn_disabled')  
  .attr('id','prev_btn')
  .attr('type','image')
  .attr('name','PrevToggle')
  .attr('title', 'PrevToggle')
  .attr('disabled', true)
  .style('display',globals.condition == 'stepper' ? null : 'none')
  .attr('src', globals.condition == 'stepper' ? 'assets/prev_grey.svg' : 'assets/na.svg')
  .on('touchstart', function() {    
    d3.event.preventDefault();    

    if (globals.condition == 'stepper'){

      clearTimeout(giveup);
      giveUpLoop();

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
      trial.prev_step_count++;
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
        trial.prev_step_count++;
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
  .attr('class', 'img_btn_disabled')  
  .attr('type','image') 
  .attr('name','NextToggle')
  .attr('title', 'NextToggle')
  .style('display',globals.condition == 'stepper' ? null : 'none')
  .attr('src', globals.condition == 'stepper' ? 'assets/next.svg' : 'assets/na.svg')
  .attr('disabled', globals.condition == 'stepper' ? null : true)
  .on('touchstart', function() {    
    d3.event.preventDefault();    

    if (globals.condition == 'stepper'){

      clearTimeout(giveup);
      giveUpLoop();

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
          if (globals.num_selected == globals.trials[globals.trial_index].num_responses){          
            d3.select('#progress_indicator').style('display','none');
            d3.select('#done_btn').attr('class','img_btn_enabled')
            .style('display',null)
            .attr('disabled',null)
            .attr('src', 'assets/done.svg');
          }
        }
        chart_instance.current_year(next_year);
      }
      trial.next_step_count++;
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
            if (globals.num_selected == globals.trials[globals.trial_index].num_responses){          
              d3.select('#progress_indicator').style('display','none');
              d3.select('#done_btn').attr('class','img_btn_enabled')
              .style('display',null)
              .attr('disabled',null)
              .attr('src', 'assets/done.svg');
            }
          }
          chart_instance.current_year(next_year);
        }
        trial.next_step_count++;
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

  var prompt = menubar.append("div")
  .attr('id','prompt')
  .on('touchstart', function() {    
    d3.event.preventDefault(); 
  });

  prompt.append('span')
  .attr('class','task_instruction_span')
  .html('');  

  menubar.append("input")
  .attr('class', 'img_btn_disabled')
  .attr('disabled',true)
  .style('display','none')
  .attr('id','done_btn')
  .attr('type','image')
  .attr('name','Done')
  .attr('title', 'Done')
  .attr('src', 'assets/na.svg')
  .on('touchstart', endTrial);

  //progress indicators
  var progress_colors = {
    outer_fill: 'gold',
    inner_fill: '#fff',
    track: '#999',
    stroke: '#333',
  };

  var progress_radius = (height < width ? (height / 7 - 6) : (width / 7 - 6)) / 2;
  var progress_stroke = 2;
  var progress_dim = progress_radius * 2;

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
  .attr('display', globals.facets == 'on' ? 'none' : null)
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

  function update_outer_progress(progress) {
    d3.select('#outer_progress_value').attr('d', globals.outer_progress_circle.endAngle((Math.PI * 2) * progress));
  } 

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

module.exports = trial;
