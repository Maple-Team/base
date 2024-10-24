export interface LarkMessageText {
  msg_type: 'text'
  content: Content
}

interface Content {
  text: string
}
