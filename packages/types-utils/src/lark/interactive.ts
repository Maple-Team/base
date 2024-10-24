export interface LarkMessageInteractive {
  msg_type: 'interactive'
  card: Card
}

interface Card {
  elements: Element[]
  header: Header
}

interface Element {
  tag: string
  text?: Text
  actions?: Action[]
}

interface Text {
  content: string
  tag: string
}

interface Action {
  tag: string
  text: Text
  url: string
  type: string
  value: Value
}

interface Value {}

interface Header {
  title: Title
}

interface Title {
  content: string
  tag: string
}
