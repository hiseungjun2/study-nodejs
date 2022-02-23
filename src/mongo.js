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

async function main() {
  await client.connect()

  // 여러 개의 document > 한 개의 collection
  const users = client.db('fc21').collection('users')
  const cities = client.db('fc21').collection('cities')

  // 데이터 비우기 (Reset)
  await users.deleteMany({})
  await cities.deleteMany({})

  // 데이터 추가
  await cities.insertMany([
    {
      name: '서울',
      population: 1000,
    },
    {
      name: '부산',
      population: 350,
    },
  ])
  await users.insertMany([
    {
      name: 'Foo',
      birthYear: 2000,
      contacts: [
        {
          type: 'phone',
          number: '+821000001111',
        },
        {
          type: 'home',
          number: '+82021231112',
        },
      ],
      city: '서울',
    },
    {
      name: 'Bar',
      birthYear: 1995,
      contacts: [
        {
          type: 'phone',
        },
      ],
      city: '부산',
    },
    {
      name: 'Baz',
      birthYear: 1990,
      city: '부산',
    },
    {
      name: 'Poo',
      birthYear: 1993,
      city: '서울',
    },
  ])

  // await users.deleteOne({
  //   name: 'Baz',
  // })

  // await users.updateOne(
  //   {
  //     name: 'Baz',
  //   },
  //   {
  //     // 변경할 값
  //     $set: {
  //       name: 'Boo',
  //     },
  //   }
  // )

  // 데이터 찾기 (join 과 비슷하게)
  const cursor = users.aggregate([
    {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: 'name',
        as: 'city_info',
      },
    },
    {
      $match: {
        $and: [
          {
            'city_info.population': {
              $gte: 500,
            },
          },
          {
            birthYear: {
              $gte: 1995,
            },
          },
        ],
      },
    },
    {
      $count: 'num_users',
    },
  ])

  // 데이터 찾기
  // const cursor = users.find(
  //   {
  //     'contacts.type': 'phone',
  //   }
  //   // {
  //   //   birthYear: {
  //   //     // 1995 이상
  //   //     $gte: 1995,
  //   //   },
  //   // },
  //   // {
  //   //   sort: {
  //   //     // 1 오름차순, 2. 내림차순
  //   //     birthYear: 1,
  //   //   },
  //   // }
  // )

  await cursor.forEach(console.log)

  await client.close()
}

main()
