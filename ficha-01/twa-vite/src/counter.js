// Ficha 01 · step 4: count DOWN and mirror the value in the tab title.
const START = 10

export function setupCounter(element) {
  let counter = START
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `Count is ${counter}`
    document.title = `(${counter}) twa-vite`
  }
  element.addEventListener('click', () => setCounter(counter - 1))
  setCounter(START)
}
