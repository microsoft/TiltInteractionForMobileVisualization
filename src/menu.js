var d3 = require("d3");
var globals = require("./globals");

function menu () {
    
  /** INIT **/
  
  d3.select('body').append('div')
  .attr('id','menu_div')
  .attr('tabindex',0);  

  var instruction_div = d3.select('#menu_div').append('div')
  .attr('class','toolbar')
  .attr('id','instruction_div')
  .style('height','50px');  

  instruction_div.append('span')
  .attr('id','instruction_text')
  .html('<span class="instruction_emphasis">BUBBLE <span class="instruction_emphasis" id="secret_sandbox">CHARTS</span> ON MOBILE PHONES</span><br>Tap on the buttons below to proceed with the experiment.');  
  
  var navbar = d3.select('#menu_div').append('div')
  .attr('class','toolbar')
  .attr('id','navbar');

  navbar.append("input")
  .attr('class', test_override || !consent_complete ? 'menu_btn_enabled' : 'menu_btn_disabled')
  .attr('disabled', test_override || !consent_complete ? null : true)
  .attr('id','consent_btn')    
  .attr('type','button')
  .attr('value','1. Consent to Participate')
  .attr('title', '1. Consent to Participate');

  navbar.append("input")
  .attr('class', test_override || (!introduction_complete && consent_complete) ? 'menu_btn_enabled' : 'menu_btn_disabled')
  .attr('disabled', test_override || (!introduction_complete && consent_complete) ? null : true)
  .attr('id','introduction_btn')    
  .attr('type','button')
  .attr('value','2. Introduction to the Experiment')
  .attr('title', '2. Introduction to the Experiment');  

  navbar.append("input")
  .attr('id','trial_btn')
  .attr('class', (test_override || (introduction_complete && !experiment_complete)) ? 'menu_btn_enabled' : 'menu_btn_disabled')
  .attr('disabled', (test_override || (introduction_complete && !experiment_complete)) ? null : true)
  .attr('type','button')
  .attr('value','3. Experiment')
  .attr('title', '3. Experiment');

  navbar.append("input")
  .attr('class', (test_override || experiment_complete) ? 'menu_btn_enabled' : 'menu_btn_disabled')
  .attr('disabled', (test_override || experiment_complete) ? null : true)
  .attr('id','questionnaire_btn')    
  .attr('type','button')
  .attr('value','4. Survey & Conclusion')
  .attr('title', '4. Survey & Conclusion');

  d3.select('#menu_div').append('div')
  .attr('class','toolbar')
  .attr('id','menu_footer')
  .html('<span> <a href="mailto:mabrehme@microsoft.com" target="_blank">Contact</a> | <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank">Privacy & Cookies</a> | <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx" target="_blank">Terms of Use</a> | © 2018 Microsoft</span>');  

  // var param_list = [
  //   "Life Expectancy",
  //   "Income Per Capita ($)",
  //   "GDP Per Capita ($)",
  //   "Fertility Rate",
  //   "CO2 Emissions",
  //   "Population",
  //   "Electricity Consumption (kWh)",
  //   "Infant Mortality (per 1k births)",
  //   "Murder Rate (per 100k)",
  //   "Traffic Mortalities (per 100k)"
  // ];

  // var param_list = [
  //   "Population",
  //   "Arable Area",
  //   "Energy Consumption",
  //   "GDP Per Capita",
  //   "Life Expectancy (Women)",
  //   "Life Expectancy (Men)",
  //   "Life Expectancy",
  //   "Infant Mortality",
  //   "Number of Personal Computers"
  // ];

  // navbar.append("select")
  // .attr('id','x_picker')
  // .attr('class','menu_select_enabled')
  // .on('change', function() {
  //   if (globals.param_y == d3.select(this).property('value')){
  //     d3.select(this).property('value', globals.param_x);
  //     alert('x != y');
  //   }
  //   else{
  //     globals.param_x = d3.select(this).property('value');
  //   }
  //   console.log(globals.param_x);
  // })
  // .selectAll('option')
  // .data(param_list)
  // .enter()
  // .append('option')
  // .attr("value", function (d) { return d; })
  // .text(function (d) { return 'x: ' + d; })
  // .property("selected", function (d) {
  //   return d === globals.param_x;
  // });

  // navbar.append("select")
  // .attr('id','y_picker')
  // .attr('class','menu_select_enabled')  
  // .on('change', function() {
  //   if (globals.param_x == d3.select(this).property('value')){
  //     d3.select(this).property('value', globals.param_y);
  //     alert('y != x');
  //   }
  //   else {
  //     globals.param_y = d3.select(this).property('value');
  //   }
  //   console.log(globals.param_y);
  // })
  // .selectAll('option')
  // .data(param_list)
  // .enter()
  // .append('option')
  // .attr("value", function (d) { return d; })
  // .text(function (d) { return 'y: ' + d; })
  // .property("selected", function (d) {
  //   return d === globals.param_y;
  // });
 
}

module.exports = menu;
