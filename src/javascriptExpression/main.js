// 타입스크리트 문법 체크
// @ts-check

// Formatting, Linting, Type Checking
// Formatting : 콜론이나 등등 문법 체크 등, Prettier
// Linting : 혹여나 에러가 나는 것을 잡아줄 때, ESLint
// Type Checking : TypeScript

const http = require('http')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.end('Hello')
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`The server is listening at port : ${PORT}. `)
})
