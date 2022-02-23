// @ts-check

/* eslint-disable no-console */

const express = require('express')
const multer = require('multer') // 사진 업로드 라이브러리

const upload = multer({
  dest: 'uploads/',
})

const router = express.Router()

const USERS = {
  15: {
    nickname: 'foo',
    profileImageKey: undefined,
  },
  16: {
    nickname: 'bar',
    profileImageKey: undefined,
  },
}

router.get('/', (req, res) => {
  res.send('User list')
})

router.param('id', async (req, res, next, value) => {
  try {
    // @ts-ignore
    const user = USERS[value]

    if (!user) {
      const err = new Error('User not found.')
      err.statusCode = 404
      throw err
    }

    // @ts-ignore
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
})
// /user/15
router.get('/:id', (req, res) => {
  // 반환 타입
  const resMimeType = req.accepts(['json', 'html'])

  if (resMimeType === 'json') {
    // @ts-ignore
    res.send(req.user)
  } else if (resMimeType === 'html') {
    res.render('user-profile', {
      // @ts-ignore
      nickname: req.user.nickname,
      userId: req.params.id,
      // profileImageURL: '/uploads/3f3bd33d7dca35020c279d235e11493b',
      profileImageURL: `/uploads/${req.user.profileImageKey}`,
    })
  }
})

router.post('/', (req, res) => {
  // Register user
  res.send('User regustered')
})

// 닉네임 변경
router.post('/:id/nickname', (req, res) => {
  // req.body: {"nickname": "bar"}
  // @ts-ignore
  const { user } = req
  const { nickname } = req.body

  user.nickname = nickname

  res.send(`User nickname updated: ${nickname}`)
})

// 프로필 이미지 저장
router.post('/:id/profile', upload.single('profile'), (req, res, next) => {
  const { user } = req
  const { filename } = req.file
  user.profileImageKey = filename

  res.send(`User profile image uploaded: ${filename}`)
})

module.exports = router
