# Lark

## 带参考

```ts
type LarkMsgType = 'text' | 'post' | 'interactive'
// TODO 完善 |'share_chat' | 'image'
interface Content {
  /**
   * 文本消息的 @ 用法
   * // @ 单个用户
        <at user_id="ou_xxx">名字</at>
      // @ 所有人
        <at user_id="all">所有人</at>
   */
  text: string
}
interface TextMessage {
  msg_type: 'text'
  content: Content
}
interface RichTextContent {
  post: Post
}
interface Paragraph {
  tag: 'text' | 'a' | 'at'
  text: string
  href?: string
  user_id?: string
}
interface PostContent {
  title: string
  content: [Paragraph]
}
interface Post {
  zh_cn?: PostContent
  en_us?: PostContent
}

interface RichTextMessage {
  msg_type: 'post'
  content: RichTextContent
}
interface MarkdownTextContent {
  content: string
  tag: 'lark_md'
}
/**
 * 展示性
 */
interface ElementsText {
  tag: 'div'
  text: MarkdownTextContent
}
/**
 * 操作性
 */
interface ElementsAction {
  tag: 'button'
  text: MarkdownTextContent
  url: string
  type: 'default'
  value: any
}
interface ElementsActions {
  tag: 'action'
  actions: ElementsAction[]
}
type Elements = ElementsText | ElementsActions
interface HeaderTitle {
  content: string
  tag: 'plain_text'
}
interface Header {
  title: HeaderTitle
}
interface Card {
  elements: Elements[]
  header: Header
}

interface InteractiveMessage {
  msg_type: 'interactive'
  card: Card
}
```
