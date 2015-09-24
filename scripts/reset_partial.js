require('../validate-environment');

var neo4jClient = require('../lib/db/neo4jclient');

var q = [
  'MATCH (u:User)',
  'WHERE has(u.partial)',
  'REMOVE u.partial'
].join('\n');

return neo4jClient.query(q)
  .catch(function(err) {
    console.error(err);
    throw err;
  });
