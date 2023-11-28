"use strict";

const Transport = require("winston-transport");
const axios = require("axios").default;

module.exports = class LarkHook extends Transport {
  constructor(opts) {
    super(opts);

    opts = opts || {};

    this.name = opts.name || "larkWebhook";
    this.level = opts.level || undefined;
    this.webhookUrl = opts.webhookUrl;
    this.formatter = opts.formatter || undefined;


    this.axiosInstance = axios.create({
      proxy: opts.proxy || undefined
    });
  }

  async log(info, callback) {
    /**
     * @type import('./index').TextMessage
     */
    let payload = {
      msg_type: 'text'
    };

    if (this.formatter && typeof this.formatter === "function") {
      let layout = this.formatter(info);

      if (!layout) {
        callback();
        return;
      }

      // Note: Supplying `text` when `blocks` is also supplied will cause `text`
      // to be used as a fallback for clients/surfaces that don't suopport blocks
      Object.keys(layout).forEach((key) => {
        payload[key] = layout[key];
      });
    } else {
      payload.content = { text: `${info.level}: ${info.message}` };
    }

    try {
      await this.axiosInstance.post(this.webhookUrl, payload);
      this.emit("logged", info);
    } catch (err) {
      if (this.emitAxiosErrors) this.emit("error", err);
    } finally {
      callback();
    }
  }
};