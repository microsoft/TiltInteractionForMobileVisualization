var globals = require("./globals");
var nationData = require("./data/studyData");
var taskList = require("./tasks/taskList");

function initTasks() {

  nationData.forEach(function (d){ 
    d.orig_code = d.code;
  });

  if (window.location.href.indexOf('mobubble') == -1) {

    globals.trials = taskList[globals.ordering];     

    // var rand_order = Math.random();  

    // if (rand_order < 0.2) {
    //   globals.trials = taskList[0];
    // }
    // else if (rand_order >= 0.2 && rand_order < 0.4) {
    //   globals.trials = taskList[1];
    // }
    // else if (rand_order >= 0.4 && rand_order < 0.6) {
    //   globals.trials = taskList[2];
    // }
    // else if (rand_order >= 0.6 && rand_order < 0.8) {
    //   globals.trials = taskList[3];
    // }
    // else {
    //   globals.trials = taskList[4];
    // }
    // globals.ordering = Math.floor(rand_order / 0.2);

    // // console.log(nationData);   
    // max_trials = taskList.length;

    // var tutorial_tasks = taskList.slice(0,3);
    // var test_tasks = taskList.slice(3,taskList.length);
    // test_tasks = shuffle(test_tasks);

    // //correct cases where two consecutive trials have same pair of axes
    // var corrected = false;
    // var swap_count = 0;
    // while (!corrected){
    //   corrected = true; //assume the shuffling produced no two consecutive trials with the same pair of axes
    //   if (swap_count > test_tasks.length) {
    //     // console.log('reshuffling');
    //     test_tasks = shuffle(test_tasks); // reshuffle if excessive swapping occurs
    //   }
    //   var tmp;
    //   for (var i = 0; i < (test_tasks.length - 2); i++){

    //     //test if this task and the next share the same axes
    //     if (test_tasks[i].x == test_tasks[i+1].x && test_tasks[i].y == test_tasks[i+1].y){

    //       //a swap is needed, set the corrected flag to false
    //       // console.log('swapping trials ' + (i+1) + ' and ' + (i+2));
    //       swap_count++;
    //       corrected = false;
    //       tmp = test_tasks[i+2];
    //       test_tasks[i+2] = test_tasks[i+1];
    //       test_tasks[i+1] = tmp;
    //     }
    //   }
    //   //check the last two trials
    //   if (test_tasks[test_tasks.length-2].x == test_tasks[test_tasks.length-1].x && test_tasks[test_tasks.length-2].y == test_tasks[test_tasks.length-1].y) {
    //     // console.log('swapping trials ' + (test_tasks.length-1) + ' and 0');
    //     swap_count++;
    //     corrected = false;
    //     tmp = test_tasks[0]; //swap last to first
    //     test_tasks[0] = test_tasks[test_tasks.length-1];
    //     test_tasks[test_tasks.length-1] = tmp;
    //   }
    // }

    max_trials = globals.trials.length;

    // globals.trials = tutorial_tasks.concat(test_tasks);
    console.log('task_list', globals.trials);

    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "user_id": globals.userID, 
      "participant": globals.participant,
      "ordering": globals.ordering,
      "condition": globals.condition,
      "Event":"Load",
      "Width": window.innerWidth, 
      "Height": window.innerHeight,
      "Mode": (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
    };
  
    console.log("Load", globals.log_message);
    appInsights.trackEvent("Load", globals.log_message);

  }
}

module.exports = initTasks;