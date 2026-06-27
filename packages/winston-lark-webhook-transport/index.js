'use strict'

const Transport = require('winston-transport')
const axios = require('axios').default

// TODO 改写成ts
module.exports = class LarkHook extends Transport {
  /**
   *
   * @param {import('./index').LarkHookHookOptions} opts
   */
  constructor(opts) {
    super(opts)

    opts = opts || {}
    this.name = opts.name || 'larkWebhook'
    this.level = opts.level
    this.webhookUrl = opts.webhookUrl
    this.msgType = opts.msgType
    this.formatter = opts.formatter || undefined
    this.appVersion = opts.appVersion || 'N/A'

    this.axiosInstance = axios.create({
      proxy: opts.proxy || undefined,
    })
  }

  /**
   *
   * @param {import('./index').TransformableInfo} info
   * @param {() => void} callback
   * @returns
   */
  async log(info, callback) {
    /**
     * ignore if level not match
     */
    if (info.level !== this.level) {
      callback()
      return
    }

    const payload = {
      msg_type: this.msgType,
    }

    if (this.formatter && typeof this.formatter === 'function') {
      const layout = this.formatter(info)

      if (!layout) {
        callback()
        return
      }

      // Note: Supplying `text` when `blocks` is also supplied will cause `text`
      // to be used as a fallback for clients/surfaces that don't suopport blocks
      Object.keys(layout).forEach((key) => {
        payload[key] = layout[key]
      })
    } else {
      const message = `错误平台: Node
应用版本: ${this.appVersion}
错误信息: ${info.message?.trim() ?? ''}
错误栈: ${info.stack ?? ''}`

      switch (this.msgType) {
        case 'text':
          payload.content = {
            text: message,
          }
          break
        case 'post':
          payload.content = {
            post: {
              zh_cn: {
                title: '应用出错了',
                content: [{ tag: 'text', text: message }],
              },
            },
          }
          break
        case 'interactive':
          payload.card = {
            elements: [
              {
                tag: 'div',
                text: {
                  content: message,
                  tag: 'plain_text',
                },
              },
              // TODO actions
            ],
            headers: {
              title: {
                content: '应用出错了',
                tag: 'plain_text',
              },
            },
          }
          break
        default:
          break
      }
    }

    try {
      await this.axiosInstance
        .post(this.webhookUrl, payload)
        .then((res) => res.data)
        .then((res) => {
          if (res.code !== 0) throw new Error(res.msg)
        })
        .catch((err) => {
          console.error('@liutsing/winston-lark-webhook-transport error:', err)
          this.emit('error', err)
          throw err
        })
      this.emit('logged', info)
    } catch (err) {
      if (this.emitAxiosErrors) this.emit('error', err)
    } finally {
      callback()
    }
  }
}
