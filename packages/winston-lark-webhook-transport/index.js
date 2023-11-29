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

    this.axiosInstance = axios.create({
      proxy: opts.proxy || undefined,
    })
  }

  async log(info, callback) {
    /**
     * ignore if level not match
     */
    if (info.level !== this.level) {
      callback()
      return
    }

    /**
     * @type import('./index').LarkMessage
     */
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
      switch (this.msgType) {
        case 'text':
          payload.content = { text: info.message }
          break
        case 'post':
          payload.content = {
            post: {
              zh_cn: {
                title: '应用出错了',
                content: [{ tag: 'text', text: info.message }],
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
                  content: info.message,
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
