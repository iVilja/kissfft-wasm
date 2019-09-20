export function sleep(time: number): Promise<void> {
  return new Promise((done) => {
    setTimeout(() => {
      done()
    }, time)
  })
}
