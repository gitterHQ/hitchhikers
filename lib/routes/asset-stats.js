var path = require('path');
var router = require('express').Router();

router.get('/stats', function(req, res) {

  var stats = require(path.resolve(__dirname, '../../build/stats.json'));

  var results = stats.assets.map(function(asset) {
    return asset.name;
  });

  res.json(results);

});

module.exports = router;
