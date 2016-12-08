const pg = require('pg');

// var config = {
//   database : 'slogans'
// };

const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
console.log('params', params);
const auth = params.auth.split(':');
console.log('auth', auth);

var config = {

      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
      ssl: true


};
console.log('config', config);

var pool = new pg.Pool(config);

module.exports = pool;
