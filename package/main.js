const { sleep } = require('@seungjun/fc21-nodejs-pkg')

async function main() {
  console.log('before sleep')
  await sleep(1000)
  console.log('after sleep')
}

main()
