// @ts-check

/* eslint-disable no-console */

const express = require('express')

// express 객체 만들기
const app = express()
// 포트
const PORT = 5000

app.use('/', (req, res) => {
  res.send('Hello, express!')
})

app.listen(PORT, () => {
  console.log(`The Express server is listening at port: ${PORT}`)
})
