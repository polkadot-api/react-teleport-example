import SmWorker from "polkadot-api/smoldot/worker?worker"
import { startFromWorker } from "polkadot-api/smoldot/from-worker"

/*
interface QueueNode<T> {
  value: T
  next?: QueueNode<T>
}

export default class Queue<T> {
  private first?: QueueNode<T>
  private last?: QueueNode<T>

  constructor(...vals: T[]) {
    if (vals.length === 0) return
    vals.forEach((val) => this.push(val))
  }

  push(value: T) {
    const nextLast: QueueNode<T> = { value }
    if (this.last === undefined) {
      this.last = nextLast
      this.first = this.last
    } else {
      this.last.next = nextLast
      this.last = nextLast
    }
  }

  pop() {
    const result = this.first?.value
    if (this.first) {
      this.first = this.first.next
      if (!this.first) {
        this.last = undefined
      }
    }
    return result
  }

  peek() {
    return this.first?.value
  }
}

const messages = new Queue<string>()

let tickDate = ""

const setTickDate = () => {
  tickDate = new Date().toISOString()
  setTimeout(setTickDate, 0)
}
setTickDate()

const getTickDate = () => tickDate
*/

export const smoldot = startFromWorker(
  new SmWorker(),
  { forbidWs: true } /*, {
  maxLogLevel: 9,
  logCallback: (level: number, target: string, message: string) => {
    messages.push(`${getTickDate()} (${level})${target}\n${message}\n\n`)
  },
}*/,
)
/*;(window as any).getLogs = () => {
  console.log("touch the window now!")
  setTimeout(() => {
    console.log("putting the logs in place")
    let data = ``
    while (messages.peek() !== undefined) {
      data += messages.pop()!
    }
    navigator.clipboard.writeText(data)
    console.log("copied!")
  }, 3_000)
}*/
