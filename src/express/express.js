// @ts-check

/* eslint-disable no-console */

const express = require('express')
const fs = require('fs')

// express 객체 만들기
const app = express()
// 포트
const PORT = 5000

app.use('/', async (req, res, next) => {
  console.log('Middleware 1-1')

  const fileContent = await fs.promises.readFile('.gitignore')
  const requestedAt = new Date()

  // 다음 요청으로 값 전달하기
  // @ts-ignore
  req.requestedAt = requestedAt
  // @ts-ignore
  req.fileContent = fileContent
  // 해당 미들웨어가 실행완료되었다고 판단하고 다음 요청으로 넘기기
  next()
})

/* 수많은 middleware들.. */

app.use((req, res) => {
  console.log('Middleware 2')
  // @ts-ignore
  res.send(`Requested at ${req.requestedAt}, ${req.fileContent} `)
})

app.listen(PORT, () => {
  console.log(`The Express server is listening at port: ${PORT}`)
})
