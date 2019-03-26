var u;

var globals = {
  width: 0,
  height: 0,
  svg_dim: u,
  inner_padding: u,
  chart_dim: u,
  padding: 0,
  main_svg: u,
  carousel_svg: u,
  defs: u,
  userID: u,
  chart_g: u,
  carousel_g: u,
  appInsights: u,
  chart_instance: u,
  carousel_instance: u,
  year_indicator: u,
  all_data: u,  
  hideAddressBar: u,
  shuffle: u,
  test_override: u,  
  touch_value: u,
  suppress_touch_feedback: u,
  suppress_touch_val_feedback: u,
  last_pause: u,
  resumptions: u,
  non_interactive: u,
  last_tilt: u,
  scale_tilt_time: u,
  scale_tilt_selection: u,
  touching: u,
  carousel_touching: u,
  selection_tilt_array: u,
  time_tilt_array: u,
  time_tilt_enabled: u,
  tps: u, //tilt events per seconds
  tilt_counter: u,
  trial_index: u,
  max_trials: u,
  ordering: u,
  participant: u,
  trials: u,
  trial_response: u,
  condition: u,
  lines: u,
  facets: u,
  animation: u,
  num_selected: u,
  outer_progress_circle: u,
  inner_progress_circle: u,
  param_x: 'Life Expectancy',
  param_y: 'GDP Per Capita',
  param_r: 'Population',
  param_yearMin: 1975,
  param_yearMax: 2000,
  highlighted_point: u,
  orientation_changed: u,
  log_message: u
};

test_override = false;
resumptions = [];
suppress_touch_feedback = false;
suppress_touch_val_feedback = false;
time_tilt_enabled = false;
touch_value = null;
trial_index = -1;
max_trials = 0;
condition = 'multiples';
ordering = 0;
participant = -1;
userID = -1;
last_tilt = new Date();
tilt_counter = 0;
tps = 0;
touching = false;
carousel_touching = false;
trial_response = [];
num_selected = 0;
highlighted_point = "";
selection_tilt_array = [];
time_tilt_array = [];
orientation_changed = true;
log_message = '';

/* jshint ignore:start */
appInsights = window.appInsights || function (config) {    
  function i(config) {
    t[config] = function() {
      var i = arguments;
      t.queue.push( function () {
        t[config].apply(t,i);
      });
    };
  }
  var t = {config:config},
      u = document,
      e = window,
      o = "script",
      s = "AuthenticatedUserContext",
      h = "start",
      c = "stop",
      l = "Track",
      a = l + "Event",
      v = l + "Page",
      y = u.createElement(o),
      r,
      f;
      y.src = config.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js";
      u.getElementsByTagName(o)[0].parentNode.appendChild(y);
      
      try{
        t.cookie=u.cookie;
      }
      catch(p){

      }
      for(t.queue = [],t.version="1.0",r=["Event","Exception","Metric","PageView","Trace","Dependency"]; r.length;)
        i("track"+r.pop());
      return i("set"+s),i("clear"+s),i(h+a),i(c+a),i(h+v),i(c+v),i("flush"),
      config.disableExceptionTracking || (r="onerror",i("_"+r),f=e[r],e[r] = function (config,i,u,e,o){
        var s=f&&f(config,i,u,e,o);
        return s!==!0&&t["_"+r](config,i,u,e,o),s;
      }),t;
}
({        
  instrumentationKey:"35044b0b-4cf4-4cce-9969-ebd62c94ac96"
});     

shuffle = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

hideAddressBar = function () {
  
  setTimeout(function(){
    // Hide the address bar!
		window.scrollTo(0, 1);
  }, 10);

  var lastTouchY = 0;
  
  var touchstartHandler = function(e) {
    if (e.touches.length != 1) return;
    lastTouchY = e.touches[0].clientY;
  };
  
  var touchmoveHandler = function(e) {
    var touchY = e.touches[0].clientY;
    var touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;

    e.preventDefault();
    return;
  };

  document.addEventListener('touchstart', touchstartHandler, {passive: false });
  document.addEventListener('touchmove', touchmoveHandler, {passive: false });

};

module.exports = globals;

