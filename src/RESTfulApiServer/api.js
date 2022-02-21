// @ts-check

// 웹 서버에서 공통으로 사용하는 묶음

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/**
 * @type {Post[]}
 */
// const posts = [
//   {
//     id: 'my_first_post',
//     title: 'My First Post',
//     content: 'Hello!',
//   },
//   {
//     id: 'my_second_post',
//     title: '나의 두번째 포스트',
//     content: 'Second post!',
//   },
// ]

/**
 * Post
 *
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */
/**
 * http localhost:4000/posts
 * http localhost:4000/posts/my_first_post
 * http POST localhost:4000/posts title=post content=foo --print=hHbB
 */

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches : string[], body: Object<string, *> | undefined) => Promise<APIResponse>} callback
 */

// 파일시스템 라이브러리
const fs = require('fs')
const DB_JSON_FILENAME = 'database.json'

// database.json 파일 읽어서 JSON 객체 만들기
/** @returns {Promise<Post[]>} */
async function getPosts() {
  const json = await fs.promises.readFile(DB_JSON_FILENAME, 'utf-8')
  return JSON.parse(json).posts
}

/** @param {Post[]} posts */
async function savePosts(posts) {
  const content = {
    posts,
  }
  return fs.promises.writeFile(
    DB_JSON_FILENAME,
    JSON.stringify(content),
    'utf-8'
  )
}

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      body: await getPosts(),
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1]
      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not found.',
        }
      }
      // ID 값에 맞는 post 찾기
      const posts = await getPosts()
      const post = posts.find((_post) => _post.id === postId)

      if (!post) {
        return {
          statusCode: 404,
          body: 'Not found.',
        }
      }

      return {
        statusCode: 200,
        body: post,
      }
    },
  },
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'Ill-formed request',
        }
      }

      /** @type {string} */
      /* eslint-disable-next-line prefer-destructuring */
      const title = body.title
      const newPost = {
        id: title.replace(/\s/g, '_'),
        title,
        content: body.content,
      }

      const posts = await getPosts()
      posts.push(newPost)

      // 저장
      savePosts(posts)
      /** @type {} */
      return {
        statusCode: 200,
        body: newPost,
      }
    },
  },
]

// 모듈에서 내보낼 객체
module.exports = {
  routes,
}
