import Transport = require('winston-transport')
// @https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot

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

declare class LarkHook extends Transport {
  constructor(opts: LarkHook.LarkHookHookOptions)
}

declare namespace LarkHook {
  interface TransformableInfo {
    level: string
    message: string
    [key: string]: any
  }

  type LarkMessage = TextMessage | RichTextMessage | InteractiveMessage

  interface LarkHookHookOptions extends Transport.TransportStreamOptions {
    /**
     * Slack incoming webhook URL.
     *
     * {@link https://api.slack.com/messaging/webhooks Follow steps 1 through 3 at this link to create a new webhook if you don't already have one}.
     */
    webhookUrl: string
    name?: string
    /**
     * Custom function to format messages with. This function accepts the `info` object ({@link https://github.com/winstonjs/winston/blob/master/README.md#streams-objectmode-and-info-objects see Winston documentation}) and must return an object with at least one of the following three keys: `text` (string), `attachments` (array of {@link https://api.slack.com/messaging/composing/layouts#attachments attachment objects}), `blocks` (array of {@link https://api.slack.com/messaging/composing/layouts#adding-blocks layout block objects}). These will be used to structure the format of the logged Slack message. By default, messages will use the format of `[level]: [message]` with no attachments or layout blocks. Return `false` to prevent this plugin from posting to Slack.
     */
    formatter?: (info: TransformableInfo) => LarkMessage | false
    /**
     * Level to log. Global settings will apply if left undefined.
     */
    level: string
    /**
     * Enables or disables {@link https://github.com/winstonjs/winston#awaiting-logs-to-be-written-in-winston emitting errors when Axios throws an error}. This can occur if Lark returns a non-200 response code, such as `429 Too Many Requests`. When disabled, Lark errors will be silently dropped. Enable to handle those errors yourself. (Default: `false`)
     */
    emitAxiosErrors?: boolean
    msgType: LarkMsgType
  }
}

export = LarkHook
