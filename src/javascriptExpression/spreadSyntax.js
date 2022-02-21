const ary = [1, 2, 3, 4, 5]

const [head, ...rest] = ary

console.log(head, rest)
console.log(head, ...rest)

const personalData = {
  email: 'abc@def.com',
  password: '****',
}

/*
const pubilcData = {
  nickname: 'foo',
}

const overrides = {
  email: 'fff@fff.com',
}

const user = {
  ...personalData,
  ...pubilcData,
  ...overrides,
}
*/

const shouldOverride = false

const user = {
  ...{
    email: 'abc@def.com',
    password: '****',
  },
  ...{
    nickname: 'foo',
  },
  ...(shouldOverride
    ? {
        email: 'fff@fff.com',
      }
    : null),
}

console.log(user)

function foo(head, ...rest) {
  console.log(head)
  console.log(rest)
}

foo(1, 2, 3, 4, 5)
