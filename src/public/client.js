// @ts-check

// IIFE
;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')
  const chatsEl = document.getElementById('chats')
  /** @type {HTMLInputElement | null} */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init failed.')
  }

  /**
   * @typedef Chat
   * @property {string} nickname
   * @property {string} message
   */

  /**
   * @type {Chat[]}
   */
  const chats = []

  const adjectives = ['멋진', '훌륭한', '친절한', '착한']
  const animals = ['물범', '사자', '사슴', '돌고래', '독수리']

  /**
   * 배열에서 랜덤으로 가져옴
   * @param {string[]} array
   * @returns {string}
   */
  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length)
    const result = array[randomIdx]
    if (!result) {
      throw new Error('array length is 0.')
    }
    return result
  }

  // 만들어진 닉네임
  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`

  // 보내기 버튼 클릭 시
  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.send(
      JSON.stringify({
        nickname: myNickname,
        message: inputEl.value,
      })
    )
    inputEl.value = ''
  })

  // 채팅목록 그리기
  const drawChats = () => {
    chatsEl.innerHTML = ''

    chats.forEach(({ nickname, message }) => {
      const div = document.createElement('div')
      div.innerText = `${nickname} : ${message}`
      chatsEl.appendChild(div)
    })
  }

  socket.addEventListener('message', (event) => {
    const { type, payload } = JSON.parse(event.data)

    if (type === 'sync') {
      const { chats: syncedChats } = payload
      chats.push(...syncedChats)
    } else if (type === 'chat') {
      const chat = payload
      chats.push(chat)
    }

    drawChats()
  })
})()
