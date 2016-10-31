const pg = require('pg');

var config = {
  database : 'slogans'
};

var pool = new pg.Pool(config);

module.exports = pool;
