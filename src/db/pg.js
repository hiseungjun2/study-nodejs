// @ts-check

// .env 파일로 프로젝트 환경변수로 사용하게 하는 라이브러리
require('dotenv').config()

const { Client } = require('pg')
const { program } = require('commander')
const prompts = require('prompts')

async function connect() {
  const client = new Client({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
  })
  await client.connect()
  return client
}

program.command('list').action(async () => {
  const client = await connect()
  const query = `SELECT * FROM users`
  const result = await client.query(query)
  console.log(result.rows)
  await client.end()
})

program.command('add').action(async () => {
  const client = await connect()
  const userName = await prompts({
    type: 'text',
    name: 'userName',
    message: 'Provide a user name to insert',
  })

  await client.query(`INSERT INTO users (name) VALUES ($1::text)`, [
    userName.userName,
  ])
  await client.end()
})

program.command('remove').action(async () => {
  const client = await connect()
  const userName = await prompts({
    type: 'text',
    name: 'userName',
    message: 'Provide a user name to delete',
  })

  // SQL injection 가능한 지점
  // const inserted = `' OR '' = '`
  // const query = `DELETE FROM users WHERE name = '${inserted}'`
  // console.log() => DELETE FROM users WHERE name = '' OR '' = ''

  await client.query(`DELETE FROM users WHERE name = $1::text`, [
    userName.userName,
  ])
  await client.end()
})

program.parseAsync()
