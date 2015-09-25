var fs = require('fs');
var assert = require('assert');

var text = fs.readFileSync(__dirname+'/env.sh.example', {encoding: 'utf8'});
var lines = text.split(/[\r\n]+/);
lines.forEach(function(line) {
  if (line.indexOf('export ') == -1) {
    return;
  }
  var parts = line.split(/[ =]/);
  if (parts.length == 3) {
    assert(process.env[parts[1]], 'process.env.'+parts[1]+' must be set.');
  }
});

