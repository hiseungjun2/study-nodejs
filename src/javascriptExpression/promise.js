// @ts-check
/* eslint-disable no-new */
/* eslint-disable no-console */

const { createIndexSignature } = require('typescript')

//
/*
new Promise((resolve, reject) => {
  console.log('Inside promise')
  console.log('before resolve')
  resolve('First resolve')
  console.log('after resolve')
  reject(new Error('First reject'))
})
  .then((value) => {
    console.log('Inside first then')
    console.log('value', value)
  })
  .catch((error) => {
    console.log('error', error)
  })
*/

function returnPromiseForTimeout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random())
    }, 1000)
  })
}

returnPromiseForTimeout()
  .then((value) => {
    console.log('value', value)
    return returnPromiseForTimeout()
  })
  .then((value) => {
    console.log('value', value)
    return returnPromiseForTimeout()
  })
  .then((value) => {
    console.log('value', value)
    return returnPromiseForTimeout()
  })
  .then((value) => {
    console.log('value', value)
    return returnPromiseForTimeout()
  })

returnPromiseForTimeout()
