// @ts-check
const fs = require('fs')

/**
 * @param {string} fileName
 */
function readFileInPromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (error, value) => {
      if (error) {
        reject(error)
      } else {
        resolve(value)
      }
    })
  })
}

async function main() {
  try {
    const result = await fs.promises.readFile('src/main.j', 'utf-8')
    console.log(result)
  } catch (error) {
    console.log('error', error)
  }
}

// readFileInPromise('src/main.js').then((value) => {
//   console.log(value)
// })

// fs.promises.readFile('src/main.js', 'utf-8').then((value) => {
//   console.log(value)
// })

main()
