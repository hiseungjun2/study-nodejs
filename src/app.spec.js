/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */

const supertest = require('supertest')
const app = require('./app')

const request = supertest(app)

test('our first test', async () => {
  const result = await request.get('/users/15').accept('application.json')
  console.log(result)
})
