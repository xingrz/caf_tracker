import Sequelize from 'sequelize';

const DB = process.env.DB || 'mysql://root@localhost/caf';
const LOG = process.argv.includes('--log-sql');

const logging = LOG
  ? log => console.log(log)
  : noop => noop;

export default new Sequelize(DB, { logging });
