// @ts-check

const { ApolloServer, gql } = require('apollo-server')
const { sequelize, User, City } = require('./sequelize')

const typeDefs = gql`
  # !는 필수값
  type User {
    id: Int!
    name: String!
    age: Int!
    city: City
  }

  type City {
    id: Int!
    name: String!
    users: [User]
  }

  type Query {
    users: [User]
  }
`

/**
 * @type {import('apollo-server').IResolvers}
 */
const resolvers = {
  Query: {
    users: async () => User.findAll(),
  },
  User: {
    city: async (user) =>
      City.findOne({
        where: {
          id: user.cityId,
        },
      }),
  },
  City: {
    users: async (city) =>
      User.findAll({
        where: {
          cityId: city.id,
        },
      }),
  },
}

async function main() {
  await sequelize.sync({ force: true })

  const seoul = await City.build({
    name: 'Seoul',
  }).save()

  await User.build({
    age: 26,
    name: 'Dodo',
    cityId: seoul.getDataValue('id'),
  }).save()

  await User.build({
    age: 20,
    name: 'Eoeo',
    cityId: seoul.getDataValue('id'),
  }).save()

  const server = new ApolloServer({ typeDefs, resolvers })

  server.listen(5000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main()
