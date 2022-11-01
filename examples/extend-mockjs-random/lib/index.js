"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mockjs_1 = require("mockjs");
var moment = require("moment");
var utils_1 = require("./utils");
mockjs_1.Random.extend({
    constellation: function () {
        return this.pick(utils_1.constellations);
    },
    unix: function (millesimal) {
        var date = (0, mockjs_1.mock)({
            date: '@date',
        }).date;
        if (millesimal) {
            return moment(date).valueOf();
        }
        else {
            return moment(date).valueOf() / 1000;
        }
    },
    coordinates: function () {
        return [Math.random() * 180, Math.random() * 90];
    },
    lng: function () {
        return this.float(-180, 180);
    },
    lat: function () {
        return this.float(-90, 90);
    },
    httpCode: function () {
        var codes = [200, 201, 206, 400, 401, 403, 404, 405, 500, 501, 502];
        return this.pick(codes);
    },
    semVer: function (major, minor, patch) {
        return "".concat(this.natural(0, major || 10), ".").concat(this.natural(0, minor || 100), ".").concat(this.natural(0, patch || 100));
    },
    d1: function () {
        return this.natural(0, 1);
    },
    d2: function () {
        return this.natural(0, 2);
    },
    sn: function (length) {
        var _this = this;
        if (length === void 0) { length = 18; }
        var pools = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: length }, function (_, i) { return i; })
            .map(function () { return pools[_this.natural(0, pools.length - 1)]; })
            .join('');
    },
    gunStatus: function (max, isFromZero, num) {
        var _this = this;
        if (isFromZero === void 0) { isFromZero = false; }
        var _num = num || this.natural(1, 4);
        return Array.from({ length: _num }, function (_, i) { return i; }).map(function () {
            return _this.natural(isFromZero ? 0 : 1, isFromZero ? max - 1 : max);
        });
    },
    jwt: function () {
        return "".concat(this.string(20, 40), ".").concat(this.string(20, 40), ".").concat(this.string(20, 40));
    },
});
