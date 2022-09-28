import { testAll } from "../common/test.js"
console.log("Testing...")
for (const log of testAll()) {
  console.log(typeof log === "string" ? log : log.join("\n"))
}
