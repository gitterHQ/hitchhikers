var fs = require('fs');
var _ = require('underscore');

var env = fs.readFileSync('env.sh', {encoding: 'utf8'});
var lines = env.split(/[\r\n]+/)
_.each(lines, function(line, i) {
  var index = line.indexOf('=');
  if (index != -1) {
    console.log(line.slice(0, index+1));
  }
});


