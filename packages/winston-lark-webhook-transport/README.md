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

## Misc

### Winston 的特点

Winston 是一个流行的 Node.js 日志记录库，具有许多令人印象深刻的功能和优势：

1. **灵活性**：Winston 提供了多个可插拔的传输器（transports），可以将日志消息发送到不同的目标，如文件、控制台、数据库、远程服务器等。你可以根据你的需求选择适当的传输器。

2. **多级别日志**：Winston 支持多级别的日志记录，包括自定义级别。你可以使用不同的日志级别来区分和过滤不同类型的日志信息。

3. **日志格式化**：Winston 允许你自定义日志消息的格式。你可以根据你的需求，选择合适的格式化选项，如时间戳、日志级别、自定义标签等。

4. **日志查询**：Winston 提供了强大的日志查询功能。你可以使用过滤器、条件和查询语法来检索和筛选特定的日志消息。

5. **日志存档和轮转**：Winston 支持日志存档和轮转功能，可以根据预定义的条件将日志文件进行归档、分割和删除，以便管理和控制日志文件的大小和数量。

6. **异常处理**：Winston 提供了异常处理功能，可以捕获和记录应用程序中的异常信息，并将其作为日志消息进行记录，以便后续分析和故障排查。

7. **插件生态系统**：Winston 拥有一个活跃的插件生态系统，你可以使用现有的插件或创建自己的插件来扩展和定制日志记录功能。

总的来说，Winston 是一个功能强大、灵活且易于使用的日志记录库，适用于各种 Node.js 应用程序和场景。它提供了丰富的功能和选项，可以帮助你有效地管理和记录应用程序的日志信息。

### 相似的 Nodejs 日志库

Winston 是一个非常流行的 Node.js 日志记录库，但也有一些类似的库可以考虑，具有类似的功能和用途。以下是一些与 Winston 相似的库：

1. Bunyan：Bunyan 是另一个功能强大的 Node.js 日志记录库，它专注于可扩展性和性能。与 Winston 类似，Bunyan 提供了多级别日志、多个传输器、自定义格式化等功能。它还具有结构化日志记录的能力，可方便地与日志分析工具集成。
2. [Pino](https://github.com/pinojs/pino)：Pino 是一个极快的 Node.js 日志记录库，它专注于性能和低资源消耗。Pino 的设计目标是尽可能减少对应用程序性能的影响。它提供了多级别日志、多个传输器、自定义格式化等功能，并且具有非常低的日志序列化开销。
3. Log4js：Log4js 是一个灵活且可配置的 Node.js 日志记录库，它与 Apache Log4j 类似。Log4js 提供了多级别日志、多个传输器、自定义格式化等功能。它还支持日志过滤器和日志追踪，可帮助进行复杂的日志记录和分析。

这些库都是相对成熟且广泛使用的日志记录库，它们提供了类似的功能，但在性能、易用性和特定需求方面可能有所不同。你可以根据自己的项目需求和偏好选择适合的日志记录库。
