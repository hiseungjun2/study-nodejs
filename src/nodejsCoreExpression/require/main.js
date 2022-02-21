// @ts-check

// ECMAScript : export, import
// CommonnJS : require
// - node stanard libaray 에 있는 모듈은 절대경로를 지정해 가져온다.
// - 이 프로젝트 내의 다른 파일은 상대경로를 지정해 가져온다.
// - 절대경로를 지정하면 module.paths 의 경로들을 순서대로 검사하여 해당 모듈이 있으면 가장 첫 번째 것을 가져온다

/* eslint-disable */

// 절대경로를 지정했을 때, 가져올 수 있는 폴더들의 경로 확인
const { paths } = module
console.log({ paths })

// ./ 은 상대경로
const animals = require('animals')
console.log(animals)
