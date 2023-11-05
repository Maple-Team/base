!(function (u) {
  'use strict'
  function n(t, i) {
    ;(t.prototype = Object.create(i.prototype)), ((t.prototype.constructor = t).__proto__ = i)
  }
  var v = (function (r) {
      function t(t, i) {
        var n
        return (
          ((n = r.call(this) || this).CLASS_NAME = 'AMap.DataCluster'),
          (n.t = t),
          (n.i = t.getMap()),
          (n.s = t.getGridSize()),
          (n.h = t.getMinClusterSize()),
          (n.o = t.isAverageCenter()),
          (n.u = t.getUserDataLen()),
          (n.v = t.v),
          (n.l = i),
          (n.p = null),
          (n.m = []),
          (n.M = []),
          (n.I = null),
          (n.g = []),
          n
        )
      }
      n(t, r)
      var i = t.prototype
      return (
        (i.j = function () {
          return this.p
        }),
        (i.O = function (t, i) {
          if (
            (0 === this.m.length && (this.p = t),
            i && (this.k = i),
            this.m.push(t),
            t._amapMarker && t._amapMarker.originData && 0 < t._amapMarker.originData.length)
          )
            for (var n = t._amapMarker.originData.length, r = 0; r < n; r++) {
              var s = t._amapMarker.originData[r]
              this.M.push(s)
            }
        }),
        (i.N = function (t) {
          if (0 === this.m.length) return !1
          var i = t._amapMarker.posContainer,
            n = this.p._amapMarker.posContainer
          return Math.abs(i.x - n.x) <= this.s && Math.abs(i.y - n.y) <= this.s
        }),
        (i.A = function (t, i) {
          if (0 === this.m.length) return !1
          for (var n = !1, r = 0; r < i.length; r++) {
            var s = i[r]
            void 0 !== t[s] && void 0 !== this.p[s] && t[s] === this.p[s] && (n = !0)
          }
          return n
        }),
        (i.S = function () {
          var t = this.m.length
          if (!t) return null
          var i = {}
          if (this.o) {
            i.lnglat = this.m[0].lnglat
            for (var n = 0, r = 0, s = 0; s < t; s++) {
              var h = this.m[s]
              if (h.lnglat) (n += parseFloat(h.lnglat.lng)), (r += parseFloat(h.lnglat.lat))
            }
            i.lnglat = [(n / t).toFixed(7), (r / t).toFixed(7)]
          } else this.p && (i.lnglat = this.p.lnglat)
          for (var o = 0, e = 0; e < t; e++) {
            o += this.m[e]._amapMarker.count
          }
          return (
            (i.COUNT = o), this.m[0] && this.m[0].originMarker && (i.originMarker = this.m[0].originMarker), this.D(i)
          )
        }),
        (i.D = function (t) {
          var i = this.t.getStyles(),
            n = t.COUNT || 1,
            r = null,
            s = i[this.J(n) - 1],
            h = this.C(n, s),
            o = this.t.renderClusterMarker,
            e = this.t.renderMarker
          return (
            n >= this.h && this.l <= this.v
              ? ((r = new u.Marker({
                  position: t.lnglat,
                  anchor: 'top-left',
                })),
                o
                  ? o.call(null, {
                      clusterData: this.m,
                      count: n,
                      marker: r,
                      indexs: this.k,
                    })
                  : (r.setContent(h.content), r.setOffset(h.offset)))
              : ((r = t.originMarker
                  ? t.originMarker
                  : new u.Marker({
                      position: t.lnglat,
                      anchor: 'top-left',
                      offset: new u.Pixel(-9, -32),
                    })),
                e &&
                  e.call(null, {
                    count: n,
                    marker: r,
                    data: this.m,
                    indexs: this.k,
                  })),
            r
          )
        }),
        (i.C = function (t, i) {
          var n = document.createElement('div')
          return (
            (n.style.width = i.size.width + 'px'),
            (n.style.height = i.size.height + 'px'),
            (n.innerHTML = t),
            (n.style.backgroundImage = 'url(' + i.url + ')'),
            (n.style.textAlign = 'center'),
            (n.style.lineHeight = i.size.height + 'px'),
            (n.style.backgroundPosition = i.imageOffset ? i.imageOffset.x + 'px ' + i.imageOffset.y + 'px' : '0 0'),
            (n.style.color = i.textColor || '#000'),
            (n.style.fontSize = i.textSize ? i.textSize + 'px' : '12px'),
            (n.style.cursor = 'pointer'),
            {
              content: n,
              offset: i.offset || new u.Pixel(0, 0),
            }
          )
        }),
        (i.J = function (t) {
          for (var i = 0, n = t; 0 !== n; ) (n = parseInt(n / 10, 10)), (i += 1)
          return (i = Math.min(i, 5))
        }),
        (i.F = function () {
          return this.m
        }),
        (i.L = function () {
          for (var t = [], i = this.M.length, n = 0; n < i; n++) {
            var r = this.M[n]
            t = t.concat(r)
          }
          return t
        }),
        (i.X = function (t) {
          var i,
            n = t.constructor === Array ? [] : {}
          if ('object' == typeof t) {
            if (window.JSON) (i = JSON.stringify(t)), (n = JSON.parse(i))
            else for (var r in t) n[r] = 'object' == typeof t[r] ? cloneObj(t[r]) : t[r]
            return n
          }
        }),
        t
      )
    })(u.Event),
    t = (function (s) {
      function t(t, i, n) {
        var r
        ;(n = n || {}),
          ((r = s.call(this) || this).Y = !1),
          (r.i = t),
          (r.s = n.gridSize || 60),
          (r.h = 2),
          (r.v = n.maxZoom || 18),
          (r.o = void 0 === n.averageCenter || n.averageCenter),
          (r.renderClusterMarker = n.renderClusterMarker || n.renderCluserMarker || null),
          (r.renderMarker = n.renderMarker || null),
          (r.G = n.clusterIndexSet || null),
          (r.R = n.styles || r.Z()),
          (r.q = n.pointStyles || r.Z()),
          (r.B = n.clusterByZoomChange || !1)
        return (
          (r.H = {
            K: {
              default: Math.floor(r.s / 3 / 1),
              P: Math.floor(r.s / 3.5 / 1),
              big: Math.floor(r.s / 4 / 1),
              T: Math.floor(r.s / 4.5 / 1),
              small: Math.floor(r.s / 5 / 1),
              U: 2,
            },
          }),
          (r.V = []),
          (r.W = []),
          (r.$ = []),
          (r._ = []),
          (r.tt = {}),
          (r.it = r.nt(i)),
          t && ((r.l = r.i.getZoom()), r.rt(), r.st(), r.ht()),
          r
        )
      }
      n(t, s)
      var i = t.prototype
      return (
        (i.setRenderMarkerStyle = function (t) {
          this.renderMarker = t
        }),
        (i.setMarkers = function (t) {
          if (!t.length) return !1
          t.length
        }),
        (i.setData = function (t) {
          ;(this.it = this.nt(t)), this.ht()
        }),
        (i.addData = function (t) {
          for (var i = this.nt(t), n = i.length, r = 0; r < n; r++) {
            var s = i[r]
            this.it.push(s)
          }
          this.ht()
        }),
        (i.getClustersCount = function () {
          return this._.length
        }),
        (i.getMap = function () {
          return this.i
        }),
        (i.setMap = function (t) {
          this.i !== t && (this.ot(), this.rt(), t && ((this.i = t), this.st(), this.ht()))
        }),
        (i.getGridSize = function () {
          return this.s
        }),
        (i.setGridSize = function (t) {
          ;(this.s = t), this.ht()
        }),
        (i.getMaxZoom = function () {
          return this.v
        }),
        (i.setMaxZoom = function (t) {
          ;(this.v = t), this.ht()
        }),
        (i.getUserDataLen = function () {
          return this.it.length
        }),
        (i.getStyles = function () {
          return this.R
        }),
        (i.setStyles = function (t) {
          ;(this.R = t), this.ht()
        }),
        (i.getMinClusterSize = function () {
          return this.h
        }),
        (i.setMinClusterSize = function (t) {
          ;(this.h = t), this.ht()
        }),
        (i.isAverageCenter = function () {
          return this.o
        }),
        (i.setAverageCenter = function (t) {
          ;(this.o = t), this.ht()
        }),
        (i.st = function () {
          this.i &&
            (this.i.on('zoomend', this.et, this),
            this.i.on('zoomstart', this.ut, this),
            this.B ? this.i.on('zoomchange', this.at, this) : this.i.on('moveend', this.moveEnd, this))
        }),
        (i.rt = function () {
          this.i &&
            (this.i.off('zoomend', this.et, this),
            this.i.on('zoomstart', this.ut, this),
            this.B ? this.i.off('zoomchange', this.at, this) : this.i.off('moveend', this.moveEnd, this))
        }),
        (i.ut = function () {
          this.Y = !0
        }),
        (i.et = function () {
          ;(this.Y = !1), this.ht()
        }),
        (i.moveEnd = function () {
          this.Y || this.ht()
        }),
        (i.at = function () {
          this.ht()
        }),
        (i.nt = function (t) {
          var i = []
          if (!t) return i
          for (var n = t.length, r = 0; r < n; r++) {
            var s = t[r]
            0 === r && void 0 !== s.weight && (this.o = !1), (s.lnglat = this.ft(s.lnglat)), s.lnglat && i.push(s)
          }
          return i
        }),
        (i.ht = function () {
          var t
          if (((this.l = this.i.getZoom()), this.l > this.v)) {
            ;(t = this.ct()), (this.V = t)
            var i = this.vt(t)
            this.lt(i)
          } else {
            ;(t = this.pt()), (this.V = t)
            var n = this.vt(t)
            this.lt(n)
          }
        }),
        (i.vt = function (t) {
          this._ = []
          var i = t.length,
            n = this.l,
            r = this.i.getBounds()
          r = this.dt(r, 5)
          for (var s = this.it.length, h = 0; h < i; h++) {
            var o = !0,
              e = t[h],
              u = (e.lnglat, e._amapMarker)
            if (this.wt(r, u.posContainer)) {
              if (((e._amapMarker.used = !0), n <= this.v && s > this.h))
                for (var a = 0; a < this._.length; a++) {
                  var f = this._[a]
                  if (f.N(e)) {
                    f.O(e), (o = !1)
                    break
                  }
                }
              if (o) {
                var c = new v(this, n)
                c.O(e), this._.push(c)
              }
            }
          }
          return this._
        }),
        (i.ct = function () {
          for (var t = this.it, i = [], n = 0; n < t.length; n++) {
            var r = t[n],
              s = r.lnglat,
              h = this.i.lngLatToContainer(s)
            ;(r._amapMarker = {
              posContainer: h,
              count: 1,
              used: !1,
            }),
              i.push(r)
          }
          return i
        }),
        (i.ot = function () {
          this.i && this.i.remove(this.W), (this.W = [])
        }),
        (i.lt = function (h) {
          for (
            var o = this,
              t = h.length,
              e = [],
              i = function (t) {
                var i = h[t],
                  n = i.j().lnglat,
                  r = i.S(),
                  s = i.L()
                e.push(r),
                  r.on('click', function () {
                    o.emit('click', {
                      cluster: i,
                      lnglat: n,
                      target: o,
                      marker: r,
                      clusterData: s,
                    })
                  }),
                  r.show()
              },
              n = 0;
            n < t;
            n++
          )
            i(n)
          this.ot(), this.i.add(e), (this.W = e)
        }),
        (i.dt = function (t, i) {
          var n = this.i.lngLatToContainer(t.getNorthEast()),
            r = this.i.lngLatToContainer(t.getSouthWest()),
            s = [parseInt(n.x), parseInt(r.x)],
            h = [parseInt(n.y), parseInt(r.y)]
          s.sort(function (t, i) {
            return t - i
          }),
            h.sort(function (t, i) {
              return t - i
            })
          var o = parseInt(this.s * i)
          return {
            Mt: parseInt(s[0] - o),
            bt: parseInt(h[1] + o),
            It: parseInt(s[1] + o),
            gt: parseInt(h[0] - o),
          }
        }),
        (i.wt = function (t, i) {
          if (!(t && i && i.x && i.y)) return !1
          var n = t.Mt,
            r = t.It,
            s = t.bt,
            h = t.gt
          return i.x < r && i.x > n && i.y > h && i.y < s
        }),
        (i.pt = function () {
          this.l = this.i.getZoom()
          var t = this.l,
            i = this.H.K.default
          6 <= t && t < 9
            ? (i = this.H.K.P)
            : 9 <= t && t < 11
            ? (i = this.H.K.big)
            : 11 <= t && t < 14
            ? (i = this.H.K.T)
            : 14 <= t && t < 16
            ? (i = this.H.K.small)
            : 16 <= t && (i = this.H.K.U)
          var n = this.it,
            r = {},
            s = [],
            h = this.i.getBounds()
          h = this.dt(h, 5)
          for (
            var o = this.i.lnglatToPixelArray([108.939621, 34.343147], this.l),
              e = Math.floor(o[0]),
              u = Math.floor(o[1]),
              a = 0;
            a < n.length;
            a++
          ) {
            var f = n[a],
              c = f.lnglat,
              v = this.i.lngLatToContainer(c)
            if (this.wt(h, v)) {
              var l = this.i.lnglatToPixelArray(c, this.l),
                p = Math.floor(l[0]),
                d = Math.floor(l[1]),
                m = f.weight,
                w = Math.floor((p - e) / i),
                M = Math.floor((d - u) / i)
              f._amapMarker = {
                posContainer: v,
                used: !1,
              }
              var b = r[w]
              if (b) {
                var I = b[M]
                I
                  ? m
                    ? I[m]
                      ? I[m].push(f)
                      : (I[m] = [f])
                    : I[0]
                    ? I[0].push(f)
                    : (I[0] = [f])
                  : ((r[w][M] = {}), m ? (r[w][M][m] = [f]) : (r[w][M][0] = [f]))
              } else (r[w] = {}), (r[w][M] = {}), m ? (r[w][M][m] = [f]) : (r[w][M][0] = [f])
            }
          }
          for (var g in r) {
            var x = r[g]
            for (var j in x) {
              var O = r[g][j],
                y = Object.keys(O),
                z = O[y[y.length - 1]],
                k = [],
                N = 0
              for (var A in O) {
                var S = O[A]
                ;(N += S.length), k.push(S)
              }
              var D = z[0]
              ;(D._amapMarker.count = N), (D._amapMarker.originData = k), z && z.length && z.length, s.push(D)
            }
          }
          return (
            s.sort(function (t, i) {
              return i.weight - t.weight
            }),
            s
          )
        }),
        (i.ft = function (t) {
          if (!t) return !1
          if (t.className && 'AMap.LngLat' === t.className) return t
          if (
            (Array.isArray(t) &&
              2 === t.length &&
              (t = {
                lng: Number(t[0]),
                lat: Number(t[1]),
              }),
            !t.lng || !t.lat)
          )
            return !1
          var i = new u.LngLat(t.lng, t.lat)
          return !!i.lat && !!i.lng && i
        }),
        (i.Z = function () {
          for (var t = [53, 56, 66, 78, 90], i = [], n = 0; n < 5; n += 1)
            i.push({
              url: 'http://webapi.amap.com/theme/v1.3/m' + (n + 1) + '.png',
              size: new u.Size(t[n], t[n]),
              offset: new u.Pixel(-t[n] / 2, -t[n] / 2, !0),
            })
          return i
        }),
        (i.X = function (t) {
          var i,
            n = t.constructor === Array ? [] : {}
          if ('object' == typeof t) {
            if (window.JSON) (i = JSON.stringify(t)), (n = JSON.parse(i))
            else for (var r in t) n[r] = 'object' == typeof t[r] ? cloneObj(t[r]) : t[r]
            return n
          }
        }),
        t
      )
    })(u.Event)
  ;(u.MarkerClusterer = t), (u.MarkerCluster = t)
})(window.AMap)
