var request = require('request')
  , fs      = require('fs')
  , sys     = require('sys')
  , path    = require('path')
  , moment  = require('moment');

var manualData = {
  //the event id is the key
  //priority: 1 - low; 2 - medium; 3 - high
  "544061d56b0287336dfc51d4": {
    isBusiness: false,
    priority: 3
  }, 

  "5441a4d43f621ea514e8dbfa": {
    isBusiness: false,
    priority: 1
  },

  "5441b5ef3f621ea514e8dc00": {
    isBusiness: false,
    priority: 2 
  },

  "5442f9aa32ff61083f0df839": {
    isBusiness: false,
    priority: 3
  }
}

//the processing
request({
  //this disables the ssl security (would accept a fake certificate). see:
  //http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature
  "rejectUnauthorized": false,
  'url': 'https://api.tnyu.org/events?teams=5440609d6b0287336dfc51cf&sort=startDateTime&include=presenters',
  'headers': {
    'x-api-key': "E]PzXKhhH5PVBvSmKlKqSZXt$li5J4SjS't"
  },
  timeout: 100000
}, function(err, response, body) {
  var events = JSON.parse(body)["events"], finalJSON;

  events.forEach(function(event) {
    var id = event.id;
    var dateTime = event.startDateTime.split("T");
    var startDate = dateTime[0];

    if(manualData[id]) {
      event.isBusiness = manualData[id].isBusiness;
      event.priority   = manualData[id].priority;
    }
    event.dayOfWeek = moment(startDate).format("dddd");
    event.startTime = moment(event.startDateTime).format("h:mm");
    event.endTime   = moment(event.endDateTime).format("h:mma");
  });

  //more processing here??

  //output merged events
  try {
    finalJSON = JSON.stringify(events);
    fs.writeFileSync('../_data/list.yaml', finalJSON);

    //rebuild jekyll
    var parentDir = path.resolve(process.cwd(), '..');
    var exec = require('child_process').exec;
    var puts = function (error, stdout, stderr){
      sys.puts(stdout)
    };
    exec("jekyll build", {cwd: parentDir}, puts);
  }

  catch(e) {
    //something went wrong converting the json...
    //just don't update the old file.
  }
});
