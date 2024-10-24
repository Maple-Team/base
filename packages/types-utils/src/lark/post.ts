export interface LarkMessagePost {
  msg_type: 'post'
  content: Content
}

interface Content {
  post: Post
}

interface Post {
  zh_cn: ZhCn
}

interface ZhCn {
  title: string
  content: paragraph[][]
}
/**
 * 每一行的消息
 */
interface paragraph {
  tag: 'text' | 'at' | 'a' | 'img'
  // text
  un_escape?: boolean
  // a
  text?: string
  href?: string
  // at
  user_id?: string
  user_name?: string
  // img
  image_key?: string
}
