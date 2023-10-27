import React, { useCallback, useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Button, Space } from 'antd'
import styles from './style.module.css'
import _points from './points.json'

const gridSize = 60
const count = _points.length
// https://lbs.amap.com/api/javascript-api-v2/documentation#markerclusteradddata
// https://lbs.amap.com/api/javascript-api-v2/guide/abc/amap-react#s9
// https://codesandbox.io/s/dian-ju-he-forked-jsn4tf?file=/index.js
// https://lbs.amap.com/demo/list/js-api-v2
// https://lbs.amap.com/demo/jsapi-v2/example/mass-markers/markerclusterer
/**
 * TODO change to jsx and use react to render jsx
 * @param context
 */
const _renderClusterMarker = function (context: AnyToFix) {
  const factor = (context.count / count) ** (1 / 18)
  const div = document.createElement('div')
  const Hue = 180 - factor * 180
  const bgColor = `hsla(${Hue},100%,40%,0.7)`
  const fontColor = `hsla(${Hue},100%,90%,1)`
  const borderColor = `hsla(${Hue},100%,40%,1)`
  const shadowColor = `hsla(${Hue},100%,90%,1)`
  div.style.backgroundColor = bgColor
  const size = Math.round(30 + (context.count / count) ** (1 / 5) * 20)
  div.style.width = div.style.height = `${size}px`
  div.style.border = `solid 1px ${borderColor}`
  div.style.borderRadius = `${size / 2}px`
  div.style.boxShadow = `0 0 5px ${shadowColor}`
  div.innerHTML = context.count
  div.style.lineHeight = `${size}px`
  div.style.color = fontColor
  div.style.fontSize = '14px'
  div.style.textAlign = 'center'
  context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
  context.marker.setContent(div)
}
/**
 * TODO change to jsx and use react to render jsx
 * @param context
 */
const _renderMarker = function (context: AnyToFix) {
  const content =
    '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>'
  const offset = new AMap.Pixel(-9, -9)
  context.marker.setContent(content)
  context.marker.setOffset(offset)
}

export default function MapContainer() {
  const map = useRef<AnyToFix>()
  const cluster = useRef<AnyToFix>()
  const [points, setPoints] = useState([])
  useEffect(() => {
    setTimeout(() => {
      setPoints(_points)
    }, 2000)
  }, [])

  const addCluster = useCallback(
    (tag: number) => {
      if (cluster.current) cluster.current?.setMap(null)

      if (tag === 2) {
        // 完全自定义
        cluster.current = new AMap.MarkerCluster(map.current, [...points], {
          gridSize, // 设置网格像素大小
          renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
          renderMarker: _renderMarker, // 自定义非聚合点样式
        })
      }
    },
    [points]
  )
  // FIXME point类型变更了
  console.log(points)

  useEffect(() => {
    AMapLoader.load({
      key: '6f025e700cbacbb0bb866712d20bb35c', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.MarkerCluster'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        map.current = new AMap.Map('container', {
          // 设置地图容器id
          viewMode: '3D', // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
          center: [116.397428, 39.90923], // 初始化地图中心点位置
        })
        addCluster(2)
      })
      .catch((e) => {
        console.log(e)
      })

    return () => {
      map.current?.destroy()
    }
  }, [addCluster])

  const onShow = useCallback(() => {
    // if (!cluster.current.getMap())
    // cluster.current.setMap(map.current)
    cluster.current.setData(points)
  }, [points])

  const onHide = useCallback(() => {
    // cluster.current.setMap(null)
    cluster.current.setData([])
  }, [])

  return (
    <>
      <Space>
        <Button onClick={onHide}>hide</Button>
        <Button onClick={onShow}>show</Button>
      </Space>
      <div
        id="container"
        className={styles.container}
        style={{ height: '800px' }}
      />
    </>
  )
}
