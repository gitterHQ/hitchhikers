var router = require('express').Router();

router.get('/country', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      country: 'usa',
      image: 'http://placehold.it/50x50',
      count: 212,
    },{
      country: 'great britan',
      image: 'http://placehold.it/50x50',
      count: 198,
    }, {
      country: 'canada',
      image: 'http://placehold.it/50x50',
      count: 76,
    }, {
      country: 'japan',
      image: 'http://placehold.it/50x50',
      count: 31,
    },{
      country: 'spain',
      image: 'http://placehold.it/50x50',
      count: 15,
    },]);
  }, 300);
});

router.get('/users', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      username: 'little john',
      image: 'http://placehold.it/50x50',
      count: 102,
    },{
      username: 'jimblack',
      image: 'http://placehold.it/50x50',
      count: 86,
    }, {
      username: 'coltrain',
      image: 'http://placehold.it/50x50',
      count: 69,
    },{
      username: 'milesdavis',
      image: 'http://placehold.it/50x50',
      count: 61,
    },{
      username: 'chetbaker',
      image: 'http://placehold.it/50x50',
      count: 54,
    },]);
  }, 350);
});

router.get('/distance', function(req, res) {
  //simulate delay
  setTimeout(function() {
    res.json([{
      username: 'malditogeek',
      image: 'http://placehold.it/50x50',
      count: 12432,
    },{
      username: 'trevorah',
      image: 'http://placehold.it/50x50',
      count: 11932,
    },{
      username: 'andrew',
      image: 'http://placehold.it/50x50',
      count: 10234,
    }, {
      username: 'ricardobeta',
      image: 'http://placehold.it/50x50',
      count: 9876,
    }, {
      username: 'mydigitalself',
      image: 'http://placehold.it/50x50',
      count: 7534,
    },]);
  }, 250);
});

module.exports = router;
