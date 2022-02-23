/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */

const supertest = require('supertest')
const app = require('./app')

const request = supertest(app)

test('retrieve user json', async () => {
  const result = await request.get('/users/15').accept('application.json')
  console.log(result.body)

  // result.body 가 아래와 같은 Object 면 된다
  // nickname 은 string
  expect(result.body).toMatchObject({
    nickname: expect.any(String),
  })
})

test('retrieve usr page', async () => {
  const result = await request.get('/users/15').accept('text/html')
  // body 는 json 으로 받을 때 데이터를 보여줄 수 있기 때문에
  // text/html 로 받을 시 result.text로 해야 html 코드를 볼 수 있다.
  console.log(result.body)
  console.log(result.text)

  // <html>로 시작하여 </html>로 끝나는 정규식
  expect(result.text).toMatch(/^<html>.*<\/html>$/)
})

test('update nickname', async () => {
  const newNickname = 'newNickname'
  const res = await request
    .post('/users/15/nickname')
    .send({ nickname: newNickname })
  // 200 코드 인지 확인
  expect(res.status).toBe(200)

  const userResult = await request.get('/users/15').accept('application.json')
  // 200 코드 인지 확인
  expect(userResult.status).toBe(200)
  // result.body 가 아래와 같은 Object 면 된다
  // nickname 은 string
  expect(userResult.body).toMatchObject({
    nickname: newNickname,
  })
})
