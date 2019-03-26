var d3 = require("d3");
var globals = require("./globals");

function consent (scene) {  
  
  /** INIT **/
  
  d3.select('body').append('div')
  .attr('id','consent_div')
  .attr('tabindex',0)
  .on('touchstart', function() {    
    d3.event.preventDefault(); 
  });  

  var consent_content_div = d3.select('#consent_div').append('div')
  .attr('class','toolbar')
  .style('width','100%')
  .style('height',(window.innerHeight - 50) + 'px')
  .attr('id','consent_content_div')
  .on('touchstart', function() {    
    d3.event.preventDefault(); 
  });  

  switch (scene) {

    case 0:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html('<span class="instruction_emphasis">Microsoft Research<br>Project Participation Consent Form</span><br>' +
      '<span style="text-align:left; font-size:0.7em;"><p>Thank you for deciding to volunteer in a Microsoft Corporation research project. The purpose of this project is to study the perception of statistical charts on mobile phones. You have no obligation to participate and you may decide to terminate your participation at any time. You also understand that the researcher has the right to withdraw you from participation in the project at any time. Below is a description of the research project, and your consent to participate. Read this information carefully.</p></span>')
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;
    
    case 1:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(
        '<span class="instruction_emphasis">Title of Experiment:</span><br>' +
        '<span style="text-align:left; font-size:0.9em;"><p><em>Bubble Charts on Mobile Phones</em></p></span>' +        
        '<span class="instruction_emphasis">Procedure:</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p>The experiment will take approximately <span class="instruction_emphasis">15 minutes</span> to complete. You will be asked to respond to a series of questions relating to  <span class="instruction_emphasis">bubble charts</span>, a type of chart that will be explained shortly. Sessions will be logged anonymously to calculate accuracy and response times. The experimental procedure is as follows:</p>' +
        '<ol>' +
        '<li> An introductory tutorial.' +
        '<li> <span class="instruction_emphasis">13 presentations</span> of bubble charts, each with an associated question.' +
        '<li> An exit survey.' +
       
        '</ol></span>'
        
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;

    case 2:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(
        '<span class="instruction_emphasis">Personal Information:</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p>This waiver is intended to give you informed consent regarding your participation in this project and also to protect your personally identifiable information by not asking for specific details, such as your name. By clicking “I agree” at the end of this form, you are agreeing that you’ve had time to read and consider this consent waiver and are comfortable with what is being asked of you as a participant. Aside from your Mechanical Turk ID, no personal information will be collected during this study. Your Mechanical Turk ID will not be shared outside of Microsoft Research and the confines of this study without your permission, and will be promptly deleted after compensation has been successfully provided (30 days or less). De-identified data may be used for future research or given to another investigator for future use without additional consent (cont.).</p></span>'        
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;

    case 3:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(
        '<span class="instruction_emphasis">Personal Information (cont.):</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p>If you wish to review or copy any personal information you provided during the study, or if you want us to delete or correct any such data, email your request to the lead researcher Matthew Brehmer (<a href="mailto:mabrehme@microsoft.com" target="_blank">mabrehme@microsoft.com</a>). If you have a privacy concern, complaint, or a question for the Chief Privacy Officer/Data Protection Officer of Microsoft, please contact us by using our <a href="https://go.microsoft.com/fwlink/?LinkId=321116" target="_blank">Web form</a>). We will respond to questions or concerns within 30 days. For additional information on how Microsoft handles your personal information, please see the <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank">Microsoft Privacy Statement</a>).</p></span>'    
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;

    case 4:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(
        '<span class="instruction_emphasis">Research Results & Feedback:</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p>Microsoft will own all of the research data and analysis and other results (collectively “Research Results”) generated from the information you provide and your participation in the research project. You may also provide suggestions, comments or other feedback (“Feedback”) to Microsoft with respect to the research project. Feedback is entirely voluntary, and Microsoft shall be free to use, disclose, reproduce, license, or otherwise distribute, and leverage the Feedback and Research Results.</p></span>'    
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;

    case 5:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(
        '<span class="instruction_emphasis">Benefits and Risks:</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p><span class="instruction_emphasis">Benefits</span>: The research team expects to better understand the perception of statistical charts on mobile phones. You will receive the specified payment after completing the HIT as well as any public benefit that may come these Research Results being shared with the greater scientific community.</p></span>' +
        '<span style="text-align:left; font-size:0.7em;"><p><span class="instruction_emphasis">Risks</span>: During your participation, you may experience risk that should not be any more significant than the risks you experience in your regular daily routine. Loss of time and compensation are also risks, particularly if you lose internet connectivity and are unable to complete the HIT. (cont.)</p></span>'        
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;

    case 6:

      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(
        '<span class="instruction_emphasis">Benefits and Risks (cont.):</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p>You accept the risks described on the previous page and whatever consequences may come of those risks, however unlikely, unless caused by our negligence or intentional misconduct. You hereby release Microsoft and its affiliates from any claim you may have now or in the future arising from such risks or consequences. In addition, you agree that Microsoft will not be liable for any loss, damages or injuries that may come of improper use of the study prototype, equipment, facilities, or any other deviations from the instructions provided by the research team. Don’t participate in this study if you feel you may not be able to safely participate in any way including due to any physical or mental illness, condition or limitation. You agree to immediately notify the research team of any incident or issue or unanticipated risk or incident.</p></span>'        
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;    

    case 7:
    
      consent_content_div.append('span')
      .attr('class','consent_text')
      .html(         
        '<span class="instruction_emphasis">Your Authority to Participate:</span><br>' +
        '<span style="text-align:left; font-size:0.7em;"><p>You represent that you have the full right and authority to sign this form, and if you are a minor that you have the consent (as indicated below) of your legal guardian to sign and acknowledge this form. By clicking “I agree” below, you confirm that you understand the purpose of the project and how it will be conducted and consent to participate on the terms set forth above. Should you have any questions concerning this project, please contact Matthew Brehmer (<a href="mailto:mabrehme@microsoft.com" target="_blank">mabrehme@microsoft.com</a>). Please confirm your acceptance by clicking “I agree” below. Upon request, a copy of this consent form will be provided to you for your records. On behalf of Microsoft, we thank you for your contribution and look forward to your research session.</p></span>' + '<span style="text-align:left; font-size:0.7em;"><p>Do you understand and consent to these terms?</p></span>'        
      )
      .on('touchstart', function() {    
        d3.event.preventDefault(); 
      });    
      
      d3.select('#consent_div')
      .style('visibility','visible');

    break;
    
    default: // return to main menu

      d3.select('#consent_div').remove();
      if (document.getElementById('consent_div') != undefined) {      
        document.getElementById('consent_div').remove(); 
      }

      globals.log_message = { 
        "TimeStamp": new Date().valueOf(),
        "Event": "ConsentComplete",
        "user_id": globals.userID
      };

      console.log("ConsentComplete", globals.log_message);
      appInsights.trackEvent("ConsentComplete", globals.log_message);
      
      consent_complete = true;
      loadMenu();
      hideAddressBar();   

    break;
  }
  
  d3.select('#consent_div').append('input')
  .attr('class', 'menu_btn_enabled')
  .attr('id','submit_btn')
  .attr('type','button')
  .attr('value', scene == 7 ? 'I AGREE' : 'NEXT')
  .attr('title', scene == 7 ? 'I AGREE' : 'NEXT')
  .on('touchstart', function() {    

    d3.event.preventDefault();  
    
    d3.select('#consent_div').remove();
    if (document.getElementById('consent_div') != undefined) {      
      document.getElementById('consent_div').remove(); 
    }

    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "user_id": globals.userID,
      "Event": "Consent",
      "Scene": scene + 1
    };

    console.log("Consent", globals.log_message);
    appInsights.trackEvent("Consent", globals.log_message);
    consent(scene + 1);
  });
 
}

module.exports = consent;
