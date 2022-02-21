// @ts-check

// BUFFER
// 1 byte = 8 bit 는 0 이상 255 이하의 값 0 ~ 2^8-1

const fs = require('fs')

// const bufFromFile = fs.readFileSync('src/test')
// const buf = Buffer.from([97, 98, 99, 100, 101])
// console.log(buf.compare(bufFromFile))

const bufA = Buffer.from([0])
const bufB = Buffer.from([3])
const bufC = Buffer.from([2])
const bufD = Buffer.from([6])

const bufs = [bufA, bufB, bufC, bufD]
// bufs.sort(Buffer.compare)
bufs.sort((a, b) => a.compare(b))
console.log(bufs)

const buf = Buffer.from([0, 0, 0, 0])
console.log(Buffer.isBuffer(buf))

/**
 * @param {*} array
 * @returns {number}
 */
function readInt32LE(array) {
  // prettier-ignore
  return (
    array[0] +
    array[1] * 256 +
    array[2] * 256 ** 2 +
    array[3] * 256 **3 
  )
}

/**
 * @param {*} array
 * @returns {number}
 */
function readInt32BE(array) {
  // prettier-ignore
  return (
    array[3] +
    array[2] * 256 +
    array[1] * 256 ** 2 +
    array[0] * 256 **3 
  )
}

console.log('LE: our function: ', readInt32LE(buf))
console.log('LE: orig function: ', buf.readInt32LE(0))

console.log('BE: our function: ', readInt32BE(buf))
console.log('BE: orig function: ', buf.readInt32BE(0))
