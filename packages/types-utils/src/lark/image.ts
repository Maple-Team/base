export interface LarkMessageImage {
  msg_type: 'image'
  content: Content
}

interface Content {
  image_key: string
}
