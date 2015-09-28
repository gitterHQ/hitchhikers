'use strict';

var neo4jClient = require('./neo4jclient');

module.exports = function() {
  var query = 'MATCH (n:Repo)-[r]-(u:User)' +
              ' WHERE n.language is not null' +
              ' RETURN n.language as language, COUNT(r) as score' +
              ' ORDER BY COUNT(r) DESC' +
              ' LIMIT 10';

  return neo4jClient.query(query)
    .then(function(results) {
      return results.data.map(function(item) {
        return {
          repoLanguage: item[0],
          score: item[1]
        };
      });

    });
};
