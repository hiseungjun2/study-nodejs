// @ts-check

// json 파일 파싱하여 숫자 더하기
// stream 이용

const { log } = console

const fs = require('fs')

/**
 *
 * @param {number} highWaterMark
 */
function processJSON(highWaterMark) {
  const rs = fs.createReadStream('local/jsons', {
    encoding: 'utf-8',
    highWaterMark, // 6글자 단위로 자름
  })

  let totalSum = 0
  let accmulatedJsonStr = ''

  rs.on('data', (chunk) => {
    if (typeof chunk !== 'string') {
      return
    }

    accmulatedJsonStr += chunk
    const lastNewLineIdx = accmulatedJsonStr.lastIndexOf('\n')

    const jsonLinesStr = accmulatedJsonStr.substring(0, lastNewLineIdx)
    accmulatedJsonStr = accmulatedJsonStr.substring(lastNewLineIdx)

    totalSum += jsonLinesStr
      .split('\n')
      .map((jsonLine) => {
        try {
          return JSON.parse(jsonLine)
        } catch {
          return undefined
        }
      })
      .filter((json) => json)
      .map((json) => json.data)
      .reduce((sum, curr) => sum + curr, 0)
  })

  rs.on('end', () => {
    log('Event: end')
    log(`totalSum (highWaterMark: ${highWaterMark})`, totalSum)
  })
}

for (let watermark = 1; watermark < 50; watermark += 1) {
  processJSON(watermark)
}
