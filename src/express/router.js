// @ts-check

/* eslint-disable no-console */

const express = require('express')
// const bodyParser = require('body-parser')
const userRouter = express.Router()

const app = express()
const PORT = 5000

app.use(express.json())

// acd | abcd
app.get('/ab?cd', (req, res) => {
  res.send('Root - GET ?')
})
// abbbbbb...cd
app.get('/ab+cd', (req, res) => {
  res.send('Root - GET +')
})
// ab[a-zA-z]cd
app.get('/ab*cd', (req, res) => {
  res.send('Root - GET *')
})
// abcd | ad - () 안에 있는 것을 한 묶음으로 판단
app.get('/a(bc)?d', (req, res) => {
  res.send('Root - GET ()')
})
// 정규식
app.get(/^\/abcd$/, (req, res) => {
  res.send('Root - GET 정규식')
})
// 배열 사용
app.get(['/abc', '/xyz'], (req, res) => {
  res.send('Root - GET 배열')
})

app.post('/', (req, res) => {
  res.send('Root - POST')
})

// 라우터 사용
userRouter.get('/', (req, res) => {
  res.send('User list')
})
const USERS = {
  15: {
    nickname: 'foo',
  },
}
userRouter.param('id', (req, res, next, value) => {
  console.log('id parameter', value)
  // @ts-ignore
  req.user = USERS[value]
  next()
})
userRouter.get('/:id', (req, res) => {
  console.log('userRouter get ID')
  // @ts-ignore
  res.send(req.user)
})
userRouter.post('/', (req, res) => {
  // Register user
  res.send('User regustered')
})
userRouter.post('/:id/nickname', (req, res) => {
  // req.body: {"nickname": "bar"}
  // @ts-ignore
  const { user } = req
  const { nickname } = req.body

  user.nickname = nickname

  res.send(`User nickname updated: ${nickname}`)
})
// 라우터 등록
app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`The Express server is listening at port: ${PORT}`)
})
