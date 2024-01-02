# # @liutsing/winston-lark-webhook-transport

> inspired by [winston-slack-webhook-transport](https://github.com/TheAppleFreak/winston-slack-webhook-transport)

A Lark transport for Winston 3+ that logs to a channel via webhooks.

## Installation

```
npm install winston @liutsing/winston-lark-webhook-transport
```

## Usage

### Set up with transports

```javascript
const winston = require('winston')
const LarkHook = require('@liutsing/winston-lark-webhook-transport')

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new LarkHook({
      webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx',
    }),
  ],
})

logger.info('This should now appear on Slack')
```

### Set up by adding

```javascript
const winston = require('winston')
const LarkHook = require('@liutsing/winston-lark-webhook-transport')

const logger = winston.createLogger({})

logger.add(new LarkHook({ webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx' }))
```

### Options

- `webhookUrl` **REQUIRED** - Slack incoming webhook URL. [Follow steps 1 through 3 at this link to create a new webhook if you don't already have one](https://api.slack.com/messaging/webhooks).
- `formatter` - Custom function to format messages with. This function accepts the `info` object ([see Winston documentation](https://github.com/winstonjs/winston/blob/master/README.md#streams-objectmode-and-info-objects)) and must return an object with at least one of the following three keys: `text` (string), `attachments` (array of [attachment objects](https://api.slack.com/messaging/composing/layouts#attachments)), `blocks` (array of [layout block objects](https://api.slack.com/messaging/composing/layouts#adding-blocks)). These will be used to structure the format of the logged Slack message. By default, messages will use the format of `[level]: [message]` with no attachments or layout blocks. A value of `false` can also be returned to prevent a message from being sent to Slack.
- `level` - Level to log. Global settings will apply if left undefined.
- `msgType` - message type. Lark support some message type like `text`, `post`, .etc.

### Message formatting
