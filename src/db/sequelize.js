// @ts-check

// .env 파일로 프로젝트 환경변수로 사용하게 하는 라이브러리
require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  database: process.env.POSTGRESQL_DATABASE,
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  dialect: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(process.env.POSTGRESQL_PORT),
})

// user 테이블 생성
const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

const City = sequelize.define(
  'city',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

// Many To One 관계 지정 (외래키)
User.belongsTo(City)

module.exports = {
  sequelize,
  User,
  City,
}
