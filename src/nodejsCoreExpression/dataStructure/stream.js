// @ts-check

const fs = require('fs')

// STREAM
// 대용량 데이터 처리에 특화된 노드의 데이터 구조
const rs = fs.createReadStream('src/test', { encoding: 'utf-8' })
rs.pipe(process.stdout)

// encoding 을 지정하게 되면
// data 에 떨어지는 데이터는 string 형태로 떨어지며 buffer 가 된다
rs.on('data', (data) => {})

rs.on('error', (error) => {})

rs.on('end', (end) => {})
