// @ts-check

const { MongoClient } = require('mongodb')

// 'mongodb+srv://KSJ:<password>@cluster0.p6020.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const uri =
  'mongodb+srv://KSJ:KSJ@cluster0.p6020.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

module.exports = client
