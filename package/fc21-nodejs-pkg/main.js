async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

function foo() {
  return 'My package'
}

module.exports.sleep = sleep
