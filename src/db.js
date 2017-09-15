import Sequelize from 'sequelize';

const DB = process.env.DB || 'mysql://root@localhost/caf';

export default new Sequelize(DB);
