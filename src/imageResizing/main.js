// @ts-check

/* 키워드로 검색해서 나온 이미지를 원하는 사이즈로 리사이징해서 돌려주는 서버 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const { createApi } = require('unsplash-js')
const { default: fetch } = require('node-fetch')
const { pipeline } = require('stream')
const { promisify } = require('util')
const sharp = require('sharp')
const { default: imageSize } = require('image-size')

// API 세팅
const unsplash = createApi({
  accessKey: 'bSBYxaRQ0qT5Rued2dJ8Y5yMBJM4dXyBOoViNJytPIY',
  // @ts-ignore
  fetch,
})

/**
 * API 사용해서 이미지 가져온다
 * @param {string} query
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({
    query,
  })

  if (!result.response) {
    throw new Error('Failed to search image.')
  }

  const image = result.response.results[0]

  if (!image) {
    throw new Error('No image found.')
  }

  return {
    description: image.description || image.alt_description,
    url: image.urls.regular,
  }
}

/**
 * 이미지를 Unsplash에서 검색하거, 이미 있다면 캐시된 이미지를 리턴한다.
 * @param {string} query
 */
async function getCachedImageOrSearchedImage(query) {
  // 이미지 폴더의 절대경로
  const imageFilePath = path.resolve(__dirname, `../../images/${query}`)
  // 이미지 폴더에 파일이 존재한다면
  if (fs.existsSync(imageFilePath)) {
    // 저장되어 있는 이미지 리턴
    return {
      message: `Returning cached image : ${query}`,
      stream: fs.createReadStream(imageFilePath),
    }
  }

  const result = await searchImage(query)
  const resp = await fetch(result.url)
  // 폴더에 이미지 저장(쓰기)
  await promisify(pipeline)(resp.body, fs.createWriteStream(imageFilePath))
  // sharp 라이브러리의 이미지 사이즈 확인
  const size = imageSize(imageFilePath)
  // 저장한 이미지 리턴
  return {
    message: `Returning new image : ${query}, width : ${size.width}, height: ${size.height}`,
    stream: fs.createReadStream(imageFilePath),
  }
}

/**
 * 요청 url 분석
 * @param {string} url
 */
function convertURLToImageInfo(url) {
  const urlObj = new URL(url, 'http://loclahost:5000')

  /**
   * @param {string} name
   * @param {number} defaultValue
   * @returns
   */
  function getSearchParam(name, defaultValue) {
    const str = urlObj.searchParams.get(name)
    return str ? parseInt(str, 10) : defaultValue
  }

  const width = getSearchParam('width', 400)
  const height = getSearchParam('height', 400)

  return {
    query: urlObj.pathname.slice(1),
    width,
    height,
  }
}

// 서버 생성
const server = http.createServer((req, res) => {
  async function main() {
    if (!req.url) {
      res.statusCode = 400
      res.end('Needs URL.')
      return
    }

    const { query, width, height } = convertURLToImageInfo(req.url)
    try {
      const { message, stream } = await getCachedImageOrSearchedImage(query)
      console.log(message)

      await promisify(pipeline)(
        stream,
        sharp()
          .resize(width, height, { fit: 'contain', background: '#ffffff' })
          .png(),
        res
      )
    } catch {
      res.statusCode = 400
      res.end()
    }
  }

  main()
})

const PORT = 5000

server.listen(PORT, () => {
  console.log('The server is listening at port', PORT)
})
