var nationData = require("./data/studyData");

function initTasks() {

  nationData.forEach(function (d){ 
    d.orig_code = d.code;
  });
}

module.exports = initTasks;