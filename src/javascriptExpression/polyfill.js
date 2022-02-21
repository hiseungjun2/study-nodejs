// @ts-check
// require('core-js')

// const complicateArray = [1, [2, 3]]
// const flatendArray = complicateArray.flat()

// console.log(flatendArray)

// const original = 'abcabc123'
// const changed = original.replaceAll('abc', 123)
// console.log(changed)

/**
 * @param {number} duration
 * @returns
 */
function sleep(duration) {
  return new Promise((resolve) => {
    console.log('sleep start')
    setTimeout(() => {
      console.log('sleep done', duration)
      resolve(duration)
    }, duration)
  })
}

function alwaysReject() {
  return new Promise((resolve, reject) => {
    reject()
  })
}

Promise.allSettled([
  sleep(1000),
  sleep(1500),
  sleep(2000),
  alwaysReject(),
]).then((value) => {
  console.log('Promise.allSettled done!', value)
})
