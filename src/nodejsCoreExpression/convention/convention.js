// @ts-check

const { log } = console

// require 시 대/소문자 구분없이 접근이 가능하지만,
// 생성되는 객체는 각각 다른 객체로 생성된다.
const a = require('./MyModule')
const b = require('./Mymodule')
const c = require('./myModule')

log(a === b, b === c)

const fs = require('fs')
const util = require('util')

const FILENAME = 'src/main.jsx'
// 비동기
// callback-style
fs.readFile(FILENAME, 'utf-8', (err, result) => {
  if (err) {
    console.error(err)
  } else {
    log(result)
  }
})

// 동기
// sync-style
try {
  const result = fs.readFileSync(FILENAME, 'utf-8')
  log(result)
} catch (err) {
  console.error(err)
}

// promise-style
async function main() {
  try {
    const result = await fs.promises.readFile(FILENAME, 'utf-8')
    // promise 를 사용할 수 없는 구 버전의 노드일 경우
    // const result = await util.promisify(fs.readFile)(FILENAME, 'utf-8')
    log(result)
  } catch (err) {
    console.error(err)
  }
}

main()
