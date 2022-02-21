// @ts-check

// OS
const os = require('os')
console.log(
  ['arch', os.arch()],
  ['platform', os.platform()],
  ['cpus', os.cpus()]
)

// child_process

// DNS
const dns = require('dns')
dns.lookup('google.com', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family)
})

// path
const path = require('path')
const fs = require('fs')
// 절대경로 가져오기
const filePath = path.resolve(__dirname, './test.txt')
console.log('filePath', filePath)
const fileContent = fs.readFileSync(filePath, 'utf-8')
console.log(fileContent)
