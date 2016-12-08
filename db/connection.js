// const pg = require('pg');
//
// var config = {
//   database : 'slogans'
// };
//
// var pool = new pg.Pool(config);
//
// module.exports = pool;

const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
      ssl: true
    }
  }
};
