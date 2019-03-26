var d3 = require("d3");
var Clipboard = require("clipboard");
var globals = require("./globals");

function questionnaire (scene) {

  var likert_rb;

  var clip = new Clipboard('.btn'); 

  clip.on("success", function(e) {

    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "Event": "CodeCopied",
      "user_id": globals.userID,
      "code": e.text
    };

    console.log("CodeCopied", globals.log_message);
    appInsights.trackEvent("CodeCopied", globals.log_message);

  });
  clip.on("error", function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);  

  });

  d3.select('#questionnaire_div').remove();
  if (document.getElementById('questionnaire_div') != undefined) {      
    document.getElementById('questionnaire_div').remove(); 
  }
  
  /** INIT **/
  
  d3.select('body').append('div')
  .attr('id','questionnaire_div')
  .attr('tabindex',0);  

  var instruction_div = d3.select('#questionnaire_div').append('div')
  .attr('class','toolbar')
  .style('height','150px')
  .style('padding-bottom','50%')
  .attr('id','instruction_div');

  var instruction_text = instruction_div.append('span')
  .attr('id','instruction_text');  

  switch (scene) {

    case 0:

      instruction_text.html('<span class="instruction_emphasis">Congratulations!</span><br>You have completed the study tasks. Please take a moment to respond to three questions about the chart design used in this study.');    

      d3.select('#questionnaire_div').append('input')
      .attr('class', 'menu_btn_enabled')
      .attr('id','submit_btn')
      .attr('type','button')
      .attr('value','NEXT')
      .attr('title', 'NEXT')
      .on('touchstart', function() {   
        
        d3.event.preventDefault();
        
        globals.log_message = { 
          "TimeStamp": new Date().valueOf(),
          "user_id": globals.userID,
          "Event": "Survey",
          "Scene": scene + 1
        };
        
        console.log("Survey", globals.log_message);
        appInsights.trackEvent("Survey", globals.log_message);

        questionnaire(scene + 1);        
        
      });

      break;  

    case 1:
    
      instruction_text.html('1. Prior to this experiment, how <span class="instruction_emphasis">familiar</span> were you with the type of chart used in this experiment on a scale ranging from <span class="instruction_emphasis">1</span> (not familiar at all) to <span class="instruction_emphasis">5</span> (very familiar)?');    

      var familiarity = 0;

      d3.select('#questionnaire_div').append('input')
      .attr('class', 'menu_btn_disabled')
      .attr('disabled', true)
      .attr('id','submit_btn')
      .attr('type','button')
      .attr('value','NEXT')
      .attr('title', 'NEXT')
      .on('touchstart', function() { 

        d3.event.preventDefault(); 
        
        if (d3.select(this).attr('disabled') == null) {

          globals.log_message = { 
            "TimeStamp": new Date().valueOf(),
            "user_id": globals.userID,
            "Event": "Survey",
            "Question": "Familiarity",
            "Response": familiarity
          };
          
          console.log("Survey", globals.log_message);
          appInsights.trackEvent("Survey", globals.log_message);
  
          questionnaire(scene + 1);          
        
        }
        
      });

      likert_rb = d3.select('#questionnaire_div').selectAll(".menu_btn_enabled")
      .data([1,2,3,4,5])
      .enter();     

      setTimeout(function(){
        likert_rb.append('input')
        .attr('class', 'menu_btn_enabled')
        .style('width','18%')
        .style('margin-left','1%')      
        .style('margin-right','1%')
        .style('transform','translate(0,0)')
        .attr('type','button')
        .attr('value',function(d){
          return(d);
        })
        .attr('title', function(d){
          return(d);
        })
        .on('touchstart', function(d) {  

          d3.event.preventDefault(); 
          
          d3.selectAll('.menu_btn_enabled').style('border', '1px solid #ccc');           
          d3.select(this).style('border', '5px solid gold');

          familiarity = d;  

          d3.select('#submit_btn').attr('class', 'menu_btn_enabled')
          .attr('disabled', null);
            
        });                   
      }, 500);    

      break;

    case 2:
    
      instruction_text.html('2. Throughout this experiment, how <span class="instruction_emphasis">confident</span> were you when responding to the questions on a scale ranging from <span class="instruction_emphasis">1</span> (not confident at all) to <span class="instruction_emphasis">5</span> (completely confident)?');    

      var confidence = 0;

      d3.select('#questionnaire_div').append('input')
      .attr('class', 'menu_btn_disabled')
      .attr('disabled', true)
      .attr('id','submit_btn')
      .attr('type','button')
      .attr('value','NEXT')
      .attr('title', 'NEXT')
      .on('touchstart', function() { 

        d3.event.preventDefault(); 
        
        if (d3.select(this).attr('disabled') == null) {

          globals.log_message = { 
            "TimeStamp": new Date().valueOf(),
            "user_id": globals.userID,
            "Event": "Survey",
            "Question": "Confidence",
            "Response": confidence
          };
          
          console.log("Survey", globals.log_message);
          appInsights.trackEvent("Survey", globals.log_message);

          questionnaire(scene + 1);          
        }

      });

      likert_rb = d3.select('#questionnaire_div').selectAll(".menu_btn_enabled")
      .data([1,2,3,4,5])
      .enter();     

      setTimeout(function(){
        likert_rb.append('input')
        .attr('class', 'menu_btn_enabled')
        .style('width','18%')
        .style('margin-left','1%')      
        .style('margin-right','1%')
        .style('transform','translate(0,0)')
        .attr('type','button')
        .attr('value',function(d){
          return(d);
        })
        .attr('title', function(d){
          return(d);
        })
        .on('touchstart', function(d) {   
          
          d3.event.preventDefault(); 
          
          d3.selectAll('.menu_btn_enabled').style('border', '1px solid #ccc');           
          d3.select(this).style('border', '5px solid gold');
          
          confidence = d;

          d3.select('#submit_btn').attr('class', 'menu_btn_enabled')
          .attr('disabled', null);   
          
        });                   
      }, 500);


      break;

    case 3:
    
      instruction_text.html('3. Throughout this experiment, how <span class="instruction_emphasis">easy</span> was it to answer the questions using the interface provided to you on a scale ranging from <span class="instruction_emphasis">1</span> (very difficult) to <span class="instruction_emphasis">5</span> (very easy)?');    

      var ease = 0;

      d3.select('#questionnaire_div').append('input')
      .attr('class', 'menu_btn_disabled')
      .attr('disabled', true)
      .attr('id','submit_btn')
      .attr('type','button')
      .attr('value','NEXT')
      .attr('title', 'NEXT')
      .on('touchstart', function() { 
        
        d3.event.preventDefault(); 

        if (d3.select(this).attr('disabled') == null) {
         
          globals.log_message = { 
            "TimeStamp": new Date().valueOf(),
            "user_id": globals.userID,
            "Event": "Survey",
            "Question": "Ease",
            "Response": ease
          };
          
          console.log("Survey", globals.log_message);
          appInsights.trackEvent("Survey", globals.log_message);
           
          questionnaire(scene + 1); 
        }

      });

      likert_rb = d3.select('#questionnaire_div').selectAll(".menu_btn_enabled")
      .data([1,2,3,4,5])
      .enter();     

      setTimeout(function(){
        likert_rb.append('input')
        .attr('class', 'menu_btn_enabled')
        .style('width','18%')
        .style('margin-left','1%')      
        .style('margin-right','1%')
        .style('transform','translate(0,0)')
        .attr('type','button')
        .attr('value',function(d){
          return(d);
        })
        .attr('title', function(d){
          return(d);
        })
        .on('touchstart', function(d) {  

          d3.event.preventDefault(); 
                  
          d3.selectAll('.menu_btn_enabled').style('border', '1px solid #ccc');           
          d3.select(this).style('border', '5px solid gold');
          
          ease = d;

          d3.select('#submit_btn').attr('class', 'menu_btn_enabled')
          .attr('disabled', null);      
          
        });          
       
      }, 500);

      break;
    
    default: // return to main menu
          
      d3.select('#instruction_div').remove();
      
      var questionnaire_content_div = d3.select('#questionnaire_div')
      .append('div')
      .attr('class','toolbar')
      .style('width','100%')
      .style('height',(window.innerHeight - 50) + 'px')
      .attr('id','intro_content_div');      
      
      //CHANGE 9907617274 FOR PRODUCTION

      questionnaire_content_div.append('span')
      .attr('class','consent_text')
      .html('<span class="instruction_emphasis">Thank you!</span><br>You have completed the survey and the study. Copy your completion code below. This code will remain valid for 30 minutes:<br><br><span class="instruction_emphasis" id="copy_code" style="user-select:all;">9907617274</span>'
      );          

      d3.select('#questionnaire_div').append('input')
      .attr('class', 'btn')
      .attr('id','submit_btn')
      .attr('type','button')
      .attr('value','Copy 9907617274')
      .attr('title', 'Copy 9907617274')
      .attr('data-clipboard-target','#copy_code')
      .attr('data-clipboard-text', '9907617274');

      globals.log_message = { 
        "TimeStamp": new Date().valueOf(),
        "Event": "SurveyComplete",
        "user_id": globals.userID
      };
      
      console.log("SurveyComplete", globals.log_message);
      appInsights.trackEvent("SurveyComplete", globals.log_message);
      
      questionnaire_complete = true;

      break;
  }

  d3.select('#questionnaire_div')
  .style('visibility','visible');

  document.getElementById('questionnaire_div').focus();  
  
}

module.exports = questionnaire;
