// @ts-check

// 스트림으로 큰 파일 처리하기!

// aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbaaaaaaaaaaab..... aaabbbbbbbbbbbaa
// 위와 같은 파일에서, a의 연속 구간(a block)의 개수와 b의 연속 구간(b block)의 개수를 세는 프로그램

const fs = require('fs')

const rs = fs.createReadStream('local/big-file', {
  encoding: 'utf-8',
  highWaterMark: 65536 * 2,
})

/** @type {Object.<string, number>} */
const numBlocksPerCharacter = {
  a: 0,
  b: 0,
}
/** @type {string | undefined} */
let prevCharacter

let chunkcount = 0

rs.on('data', (data) => {
  chunkcount += 1
  if (typeof data !== 'string') {
    return
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i] !== prevCharacter) {
      const newCharacter = data[i]

      if (!newCharacter) {
        /* eslint-disable-next-line no-continue */
        continue
      }
      prevCharacter = newCharacter
      numBlocksPerCharacter[newCharacter] += 1
    }
  }
})

rs.on('end', () => {
  console.log('Event: end')
  console.log('blockCount: ', numBlocksPerCharacter)
  console.log('chunkCount: ', chunkcount)
})
