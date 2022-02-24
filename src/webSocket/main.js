// @ts-check

// Template engine : Pug
// CSS framework : TailwindCSS

/**
 * @typedef Chat
 * @property {string} nickname
 * @property {string} message
 */

const path = require('path')
const Koa = require('koa')
const Pug = require('koa-pug')
const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')
const websockify = require('koa-websocket')
const mongoClient = require('../mongo')

const app = websockify(new Koa())

// @ts-ignore
/* eslint-disable-next-line no-new */
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

// static 폴더 마운트
app.use(mount('/public', serve('src/public')))

app.use(async (ctx) => {
  await ctx.render('main')
})

// DB 연결
/* eslint-disable-next-line no-underscore-dangle */
const _client = mongoClient.connect()

async function getChatsCollection() {
  const client = await _client
  return client.db('chat').collection('chats')
}

// Using routes
app.ws.use(
  route.all('/ws', async (ctx) => {
    // DB Collection 가져와서
    const chatsCollection = await getChatsCollection()
    // 저장되어 있던 채팅내역 가져온다 (오름차순)
    const chatsCursor = chatsCollection.find(
      {},
      {
        sort: {
          createAt: 1,
        },
      }
    )
    // 배열로 변환해서
    const chats = await chatsCursor.toArray()
    // 보낸다 (sync 타입으로, 첫 페이지 오픈 시 채팅내역 그리기)
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: {
          chats,
        },
      })
    )

    // 메시지 보낼 때
    ctx.websocket.on('message', async (data) => {
      if (typeof data !== 'string') {
        return
      }
      /** @type {Chat} */
      const chat = JSON.parse(data)
      // DB에 데이터 넣고
      await chatsCollection.insertOne({
        ...chat,
        createAt: new Date(),
      })

      const { nickname, message } = chat

      // 연결되어 있는 모든 Websocket에 대해 데이터 전부 보내기 위해 사용 (브로드캐스트)
      const { server } = app.ws
      if (!server) {
        return
      }
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              nickname,
              message,
            },
          })
        )
      })
    })
  })
)

app.listen(5000)
