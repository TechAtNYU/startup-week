var request = require('request')
  , fs      = require('fs')
  , sys     = require('sys')
  , path    = require('path')
  , moment  = require('moment-timezone');

var manualData = {
  //the event id is the key
  //priority: 1 - low; 2 - medium; 3 - high
  "544061d56b0287336dfc51d4": {
    isBusiness: false,
    priority: 3
  }, 

  "5441a5ac3f621ea514e8dbfc": {
    isBusiness: false,
    priority: 1
  },

  "544318fbe5ac6ddf5357c444": {
    isBusiness: false,
    priority: 1
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
    priority: 2
  },

  "5443027c32ff61083f0df840": {
    isBusiness: true,
    priority: 3
  },

  "54431910e5ac6ddf5357c445": {
    isBusiness: false,
    priority: 1
  },

  "5443194ce5ac6ddf5357c446": {
    isBusiness: false,
    priority: 1
  },

  "5442fba132ff61083f0df83b": {
    isBusiness: false,
    priority: 2
  },

  "54431bcae5ac6ddf5357c449": {
    isBusiness: false,
    priority: 2
  },

  "544304c6e5ac6ddf5357c428": {
    isBusiness: false,
    priority: 3
  },

  "544307aee5ac6ddf5357c42f": {
    isBusiness: true,
    priority: 2
  },

  "544305e3e5ac6ddf5357c429": {
    isBusiness: true,
    priority: 3
  },
  "54430c45e5ac6ddf5357c436": {
    isBusiness: true,
    priority: 3
  },
  "544bfa11ba0c38886d68cfd1": {
    isBusiness: true,
    priority: 3
  },
  "54430d08e5ac6ddf5357c438": {
    isBusiness: true,
    priority: 3
  },
  "54430d6be5ac6ddf5357c43b": {
    isBusiness: true,
    priority: 3
  },
  "54430efbe5ac6ddf5357c43c": {
    isBusiness: true,
    priority: 3
  },
  "54430f4be5ac6ddf5357c43d": {
    isBusiness: true,
    priority: 3
  },

  "5443037c32ff61083f0df841": {
    isBusiness: false,
    priority: 2
  },

  "54431960e5ac6ddf5357c447": {
    isBusiness: false,
    priority: 1
  },

  "54430b21e5ac6ddf5357c431": {
    isBusiness: false,
    priority: 2
  },
 
  "54432632e5ac6ddf5357c44c": {
    isBusiness: false,
    priority: 3
  }, 

  "54431029e5ac6ddf5357c43e": {
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
  var apiJson = JSON.parse(body)
    , events = apiJson["events"]
    , presenters = apiJson["linked"]["presenters"]
    , finalJSON;

  events.forEach(function(event) {
    var id = event.id
      , startTime = moment.tz(event.startDateTime, 'America/New_York')
      , endTime   = moment.tz(event.endDateTime, 'America/New_York');

    if(manualData[id]) {
      event.isBusiness = manualData[id].isBusiness;
      event.priority   = manualData[id].priority;
    }

    event.dayOfWeek = startTime.format("dddd");
    event.startTime = startTime.format("h:mm");
    event.endTime   = endTime.format("h:mma");

    //add presenter data into each events
    //this is slower than if we first read the presenters into an object
    //keyed by id, which we could then read in constant time. But whatever.
    event.presenters = ((event.links && event.links.presenters) || []).map(function(presenterId) {
      return presenters.filter(function(it) { return it.id == presenterId; })[0];
    });
  });

  //more processing here??

  //output merged events
  try {
    finalJSON = JSON.stringify(events);
    fs.writeFileSync(path.resolve(__dirname, '../_data/list.yaml'), finalJSON);

    //rebuild jekyll
    var parentDir = path.resolve(__dirname, '..');
    var exec = require('child_process').exec;
    var puts = function (error, stdout, stderr){
      sys.puts(stdout)
    };
    exec("jekyll build", {cwd: parentDir}, puts);
  }

  catch(e) {
    console.log('ERROR');
    //something went wrong converting the json...
    //just don't update the old file.
  }
});
