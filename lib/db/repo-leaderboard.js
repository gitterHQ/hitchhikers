'use strict';

var neo4jClient = require('./neo4jclient');

module.exports = function() {
  var query = 'MATCH (n:Repo)-[r]-(u:User)' +
              ' RETURN n.fullName as fullName, COUNT(r) as score' +
              ' ORDER BY score DESC' +
              ' LIMIT 10';

  return neo4jClient.query(query)
    .then(function(results) {
      return results.data.map(function(item) {
        return {
          repoFullName: item[0],
          score: item[1]
        };
      });

    });
};
