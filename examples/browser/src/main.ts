/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { testAll } from "../../common/test.js"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>KissFFT in WASM</h1>
    <pre id="result">
    </pre>
    <div>
      <button id="test" type="button">Test</button>
    </div>
  </div>
`

document.querySelector<HTMLButtonElement>("#test")!.onclick = () => {
  const resultBox = document.querySelector<HTMLButtonElement>("#result")!
  resultBox.innerText = "Testing..."
  for (const log of testAll()) {
    resultBox.innerText += "\n" + (
      typeof log === "string" ? log : log.join("\n")
    )
  }
}
