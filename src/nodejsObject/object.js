// @ts-check

// node.js 내장 객체

// 디렉터리, 파일 이름
console.log('__dirnae', __dirname)
console.log('--filename', __filename)

// 표준 입출력 담당
process.stdin.setEncoding('utf-8')
process.stdin.on('data', (data) => {
  console.log(data, data.length)
})
process.stdin.pipe(process.stdout)
// throw exception 과 비슷
// process.exit(1)
// 인자 받기
console.log(process.argv)

let count = 0
const handle = setInterval(() => {
  console.log('Interval')
  count += 1

  if (count === 4) {
    console.log('done')
    clearInterval(handle)
  }
}, 1000)

const timeoutHandle = setTimeout(() => {
  console.log('Timeout')
}, 1000)
clearTimeout(timeoutHandle)
