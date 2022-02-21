setTimeout(() => {
  const value = Math.random()
  console.log(value)

  setTimeout(() => {
    const value = Math.random()
    console.log(value)

    setTimeout(() => {
      const value = Math.random()
      console.log(value)

      setTimeout(() => {
        const value = Math.random()
        console.log(value)
      }, 1000)
    }, 1000)
  }, 1000)
}, 1000)
